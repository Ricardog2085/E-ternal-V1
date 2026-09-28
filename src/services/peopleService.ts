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
 * Obtiene o crea el perfil principal del usuario autenticado (Owner Person).
 * Flujo:
 * auth.uid()
 * ↓
 * people.user_id
 * ↓
 * people.id
 */
export async function ensureOwnerPerson(): Promise<Person> {
  if (isSupabaseConfigured() && supabase) {
    let user: any = null;

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (!userError && userData?.user) {
        user = userData.user;
      }
    } catch {
      // ignore
    }

    if (!user) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          user = sessionData.session.user;
        }
      } catch {
        // ignore
      }
    }

    if (!user) {
      // Intentar iniciar sesión anónima si está habilitada en el proyecto
      try {
        const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
        if (!anonError && anonData?.user) {
          user = anonData.user;
        }
      } catch {
        // ignore
      }
    }

    if (!user) {
      throw new Error(
        'No hay una sesión de usuario activa en Supabase (auth.uid() no disponible). Para cumplir con las políticas RLS ("auth.uid() = user_id"), inicia sesión o habilita Anonymous Sign-Ins en Authentication -> Providers -> Anonymous.'
      );
    }

    // Buscar en la tabla people donde user_id = auth.uid()
    const { data: peopleList, error: peopleError } = await supabase
      .from('people')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: true })
      .limit(1);

    if (peopleError) {
      throw new Error(`Error consultando personas en Supabase: ${peopleError.message}`);
    }

    if (peopleList && peopleList.length > 0) {
      return peopleList[0] as Person;
    }

    // Si no existe, crear el perfil principal del usuario en la tabla people
    const userMeta = user.user_metadata || {};
    const fullName = userMeta.full_name || userMeta.name || user.email?.split('@')[0] || 'Titular E-Ternal';
    const parts = fullName.trim().split(' ');
    const firstName = parts[0] || 'Titular';
    const lastName = parts.slice(1).join(' ') || '';

    const { data: newPerson, error: insertError } = await supabase
      .from('people')
      .insert([
        {
          user_id: user.id,
          first_name: firstName,
          last_name: lastName || null,
          display_name: fullName,
          status: 'active',
          bio: 'Titular de la Bóveda E-Ternal',
        },
      ])
      .select()
      .single();

    if (insertError || !newPerson) {
      throw new Error(`Error creando perfil del titular en Supabase: ${insertError?.message || 'Error desconocido'}`);
    }

    return newPerson as Person;
  }

  // Fallback si Supabase no está configurado (modo preview sin credenciales)
  const local = getLocalPeople();
  const existing = local.find((p) => p.status === 'active') || local[0];
  if (existing) return existing;

  return createPerson({
    first_name: 'Titular',
    last_name: 'E-Ternal',
    display_name: 'Titular E-Ternal',
    status: 'active',
    bio: 'Perfil principal de E-Ternal',
  });
}

/**
 * Obtiene todas las personas registradas.
 */
export async function getPeople(): Promise<Person[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('people')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Supabase getPeople error, falling back to local cache:', error.message);
    } else if (data && data.length > 0) {
      saveLocalPeople(data as Person[]);
      return data as Person[];
    }
  }

  return getLocalPeople();
}

/**
 * Obtiene una persona específica por su ID.
 */
export async function getPersonById(id: string): Promise<Person | null> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('people')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.warn(`Supabase getPersonById error for ${id}:`, error.message);
    } else if (data) {
      return data as Person;
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
    const { data, error } = await supabase
      .from('people')
      .insert([newPerson])
      .select()
      .single();

    if (error) {
      throw new Error(`Error en Supabase al crear persona: ${error.message}`);
    }
    if (data) {
      const currentLocal = getLocalPeople();
      saveLocalPeople([...currentLocal, data as Person]);
      return data as Person;
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
    const { data, error } = await supabase
      .from('people')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error en Supabase al actualizar persona: ${error.message}`);
    }
    if (data) {
      const local = getLocalPeople().map((p) => (p.id === id ? (data as Person) : p));
      saveLocalPeople(local);
      return data as Person;
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
    const { error } = await supabase.from('people').delete().eq('id', id);
    if (error) {
      throw new Error(`Error en Supabase al eliminar persona: ${error.message}`);
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
