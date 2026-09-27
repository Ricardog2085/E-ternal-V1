import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Person, FamilyMember } from '../types/eternal';
import { SEED_PEOPLE } from '../data/seedData';

const LOCAL_STORAGE_PEOPLE_KEY = 'eternal_people_fase1';

/**
 * Loads cached people from local storage with fallback to SEED_PEOPLE.
 */
function getLocalPeople(): Person[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PEOPLE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading people from localStorage:', e);
  }
  return SEED_PEOPLE;
}

/**
 * Saves people list to local cache for offline/fallback continuity.
 */
function saveLocalPeople(people: Person[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PEOPLE_KEY, JSON.stringify(people));
  } catch (e) {
    console.warn('Error saving people to localStorage:', e);
  }
}

/**
 * Obtiene todas las personas registradas.
 */
export async function getPeople(): Promise<Person[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('people')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        saveLocalPeople(data as Person[]);
        return data as Person[];
      }
    } catch (err) {
      console.warn('Supabase getPeople error, falling back to local storage:', err);
    }
  }

  return getLocalPeople();
}

/**
 * Obtiene una persona específica por su ID.
 */
export async function getPersonById(id: string): Promise<Person | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('people')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return (data as Person) || null;
    } catch (err) {
      console.warn(`Supabase getPersonById error for ${id}, using local:`, err);
    }
  }

  const local = getLocalPeople();
  return local.find((p) => p.id === id) || null;
}

/**
 * Registra una nueva persona en el sistema.
 */
export async function createPerson(
  personData: Omit<Person, 'id' | 'created_at' | 'updated_at'>
): Promise<Person> {
  const newId = crypto.randomUUID ? crypto.randomUUID() : `person-${Date.now()}`;
  const now = new Date().toISOString();

  const newPerson: Person = {
    id: newId,
    user_id: personData.user_id || null,
    first_name: personData.first_name,
    last_name: personData.last_name || null,
    display_name: personData.display_name || `${personData.first_name} ${personData.last_name || ''}`.trim(),
    birth_date: personData.birth_date || null,
    death_date: personData.death_date || null,
    profile_photo_url: personData.profile_photo_url || null,
    bio: personData.bio || null,
    status: personData.status || 'active',
    created_at: now,
    updated_at: now,
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('people')
        .insert([newPerson])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const currentLocal = getLocalPeople();
        saveLocalPeople([...currentLocal, data as Person]);
        return data as Person;
      }
    } catch (err) {
      console.warn('Supabase createPerson error, saving locally:', err);
    }
  }

  const current = getLocalPeople();
  const updated = [...current, newPerson];
  saveLocalPeople(updated);
  return newPerson;
}

/**
 * Actualiza los datos de una persona existente.
 */
export async function updatePerson(
  id: string,
  updates: Partial<Omit<Person, 'id' | 'created_at'>>
): Promise<Person> {
  const now = new Date().toISOString();
  const payload = { ...updates, updated_at: now };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('people')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const local = getLocalPeople().map((p) => (p.id === id ? (data as Person) : p));
        saveLocalPeople(local);
        return data as Person;
      }
    } catch (err) {
      console.warn(`Supabase updatePerson error for ${id}:`, err);
    }
  }

  const local = getLocalPeople();
  const existing = local.find((p) => p.id === id);
  if (!existing) {
    throw new Error(`Persona con id ${id} no encontrada.`);
  }

  const updatedPerson: Person = { ...existing, ...payload };
  const newLocal = local.map((p) => (p.id === id ? updatedPerson : p));
  saveLocalPeople(newLocal);
  return updatedPerson;
}

/**
 * Elimina una persona por su ID.
 */
export async function deletePerson(id: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from('people').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.warn(`Supabase deletePerson error for ${id}:`, err);
    }
  }

  const local = getLocalPeople().filter((p) => p.id !== id);
  saveLocalPeople(local);
}

// ==============================================================================
// ADAPTERS: Compatibilidad con UI FamilyMember existente
// ==============================================================================

export function personToFamilyMember(person: Person, assignedCount: number = 0): FamilyMember {
  const initial = (person.first_name || person.display_name).charAt(0).toUpperCase();
  return {
    id: person.id,
    personId: person.id,
    name: person.display_name,
    relation: person.bio?.includes('Hija') ? 'Hija' : person.bio?.includes('Hijo') ? 'Hijo' : person.bio?.includes('Esposa') ? 'Esposa' : 'Familiar',
    email: `${person.first_name.toLowerCase()}@legado-familiar.org`,
    isCustodian: false,
    assignedMemoriesCount: assignedCount,
    status: person.status === 'active' ? 'Activo' : 'Pendiente de Aceptación',
    avatarInitials: initial,
    note: person.bio || 'Vínculo familiar resguardado en la base de datos E-ternal.',
  };
}

export function familyMemberToPersonData(member: FamilyMember): Omit<Person, 'id' | 'created_at' | 'updated_at'> {
  const parts = member.name.trim().split(' ');
  const firstName = parts[0] || member.name;
  const lastName = parts.slice(1).join(' ') || null;

  return {
    first_name: firstName,
    last_name: lastName,
    display_name: member.name,
    status: 'active',
    bio: `${member.relation} · ${member.note || 'Miembro del círculo familiar'}`,
  };
}
