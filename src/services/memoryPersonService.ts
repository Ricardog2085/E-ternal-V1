import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MemoryPerson, Person, DbMemory } from '../types/eternal';
import { SEED_MEMORY_PEOPLE } from '../data/seedData';
import { getPeople } from './peopleService';

const LOCAL_STORAGE_MEMORY_PEOPLE_KEY = 'eternal_memory_people_fase1';

function getLocalMemoryPeople(): MemoryPerson[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MEMORY_PEOPLE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading memory_people from localStorage:', e);
  }
  return SEED_MEMORY_PEOPLE;
}

function saveLocalMemoryPeople(list: MemoryPerson[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_MEMORY_PEOPLE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Error saving memory_people to localStorage:', e);
  }
}

/**
 * Vincula un recuerdo con una persona relacionada (N:M).
 */
export async function createMemoryPerson(
  entry: Omit<MemoryPerson, 'id' | 'created_at'>
): Promise<MemoryPerson> {
  const newId = crypto.randomUUID ? crypto.randomUUID() : `mp-${Date.now()}`;
  const now = new Date().toISOString();

  const newEntry: MemoryPerson = {
    id: newId,
    memory_id: entry.memory_id,
    person_id: entry.person_id,
    relationship_context: entry.relationship_context || null,
    created_at: now,
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('memory_people')
        .insert([newEntry])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const local = getLocalMemoryPeople();
        saveLocalMemoryPeople([...local, data as MemoryPerson]);
        return data as MemoryPerson;
      }
    } catch (err) {
      console.warn('Supabase createMemoryPerson error, saving locally:', err);
    }
  }

  const current = getLocalMemoryPeople();
  const existing = current.find(
    (item) => item.memory_id === entry.memory_id && item.person_id === entry.person_id
  );
  if (existing) return existing;

  const updated = [...current, newEntry];
  saveLocalMemoryPeople(updated);
  return newEntry;
}

/**
 * Obtiene todas las personas asociadas a un recuerdo.
 */
export async function getPeopleForMemory(memoryId: string): Promise<Person[]> {
  const allPeople = await getPeople();

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('memory_people')
        .select('person_id')
        .eq('memory_id', memoryId);

      if (error) throw error;
      if (data) {
        const personIds = new Set(data.map((d: { person_id: string }) => d.person_id));
        return allPeople.filter((p) => personIds.has(p.id));
      }
    } catch (err) {
      console.warn(`Supabase getPeopleForMemory error for ${memoryId}:`, err);
    }
  }

  const local = getLocalMemoryPeople();
  const matchedPersonIds = new Set(
    local.filter((mp) => mp.memory_id === memoryId).map((mp) => mp.person_id)
  );

  return allPeople.filter((p) => matchedPersonIds.has(p.id));
}

/**
 * Elimina la asociación entre un recuerdo y una persona.
 */
export async function removeMemoryPerson(memoryId: string, personId: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('memory_people')
        .delete()
        .eq('memory_id', memoryId)
        .eq('person_id', personId);

      if (error) throw error;
    } catch (err) {
      console.warn('Supabase removeMemoryPerson error:', err);
    }
  }

  const local = getLocalMemoryPeople();
  const filtered = local.filter(
    (mp) => !(mp.memory_id === memoryId && mp.person_id === personId)
  );
  saveLocalMemoryPeople(filtered);
}
