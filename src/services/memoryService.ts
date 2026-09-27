import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  DbMemory, 
  Memory, 
  Person, 
  MediaAsset,
  DbMemoryType, 
  DbMemoryCategory,
  DbMemoryStatus 
} from '../types/eternal';
import { SEED_MEMORIES } from '../data/seedData';
import { createMemoryPerson, getPeopleForMemory } from './memoryPersonService';
import { getMediaAssetsByMemoryId } from './mediaService';

const LOCAL_STORAGE_MEMORIES_KEY = 'eternal_memories_fase1';

/**
 * Loads cached memories from local storage with fallback to SEED_MEMORIES.
 */
function getLocalDbMemories(): DbMemory[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MEMORIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading memories from localStorage:', e);
  }
  return SEED_MEMORIES;
}

/**
 * Saves db memories list to local cache for offline/fallback continuity.
 */
function saveLocalDbMemories(memories: DbMemory[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_MEMORIES_KEY, JSON.stringify(memories));
  } catch (e) {
    console.warn('Error saving memories to localStorage:', e);
  }
}

/**
 * Obtiene todos los recuerdos de la base de datos (con filtros opcionales).
 */
export async function getMemories(filter?: {
  personId?: string;
  status?: DbMemoryStatus;
  category?: DbMemoryCategory;
}): Promise<DbMemory[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('memories').select('*');

      if (filter?.personId) query = query.eq('person_id', filter.personId);
      if (filter?.status) query = query.eq('status', filter.status);
      if (filter?.category) query = query.eq('category', filter.category);

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        saveLocalDbMemories(data as DbMemory[]);
        return data as DbMemory[];
      }
    } catch (err) {
      console.warn('Supabase getMemories error, using local fallback:', err);
    }
  }

  let local = getLocalDbMemories();
  if (filter?.personId) local = local.filter((m) => m.person_id === filter.personId);
  if (filter?.status) local = local.filter((m) => m.status === filter.status);
  if (filter?.category) local = local.filter((m) => m.category === filter.category);
  return local;
}

/**
 * Obtiene un recuerdo por su ID.
 */
export async function getMemoryById(id: string): Promise<DbMemory | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return (data as DbMemory) || null;
    } catch (err) {
      console.warn(`Supabase getMemoryById error for ${id}:`, err);
    }
  }

  const local = getLocalDbMemories();
  return local.find((m) => m.id === id) || null;
}

/**
 * Crea un nuevo recuerdo en Supabase y opcionalmente asocia personas relacionadas.
 */
export async function createMemory(
  memoryData: Omit<DbMemory, 'id' | 'created_at' | 'updated_at'>,
  relatedPeopleIds?: string[]
): Promise<DbMemory> {
  const newId = crypto.randomUUID ? crypto.randomUUID() : `mem-${Date.now()}`;
  const now = new Date().toISOString();

  const newMemory: DbMemory = {
    id: newId,
    person_id: memoryData.person_id,
    title: memoryData.title,
    description: memoryData.description || null,
    content: memoryData.content || null,
    memory_type: memoryData.memory_type,
    category: memoryData.category,
    event_date: memoryData.event_date || null,
    location: memoryData.location || null,
    importance: memoryData.importance || 'normal',
    status: memoryData.status || 'ready',
    is_locked: memoryData.is_locked ?? false,
    created_at: now,
    updated_at: now,
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('memories')
        .insert([newMemory])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const local = getLocalDbMemories();
        saveLocalDbMemories([data as DbMemory, ...local]);

        // Vinculación en tabla memory_people
        if (relatedPeopleIds && relatedPeopleIds.length > 0) {
          for (const pid of relatedPeopleIds) {
            await createMemoryPerson({
              memory_id: data.id,
              person_id: pid,
              relationship_context: 'Familiar vinculado',
            });
          }
        }

        return data as DbMemory;
      }
    } catch (err) {
      console.warn('Supabase createMemory error, saving locally:', err);
    }
  }

  const local = getLocalDbMemories();
  saveLocalDbMemories([newMemory, ...local]);

  if (relatedPeopleIds && relatedPeopleIds.length > 0) {
    for (const pid of relatedPeopleIds) {
      await createMemoryPerson({
        memory_id: newMemory.id,
        person_id: pid,
        relationship_context: 'Familiar vinculado',
      });
    }
  }

  return newMemory;
}

/**
 * Actualiza los campos de un recuerdo existente.
 */
export async function updateMemory(
  id: string,
  updates: Partial<Omit<DbMemory, 'id' | 'created_at'>>
): Promise<DbMemory> {
  const now = new Date().toISOString();
  const payload = { ...updates, updated_at: now };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('memories')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const local = getLocalDbMemories().map((m) => (m.id === id ? (data as DbMemory) : m));
        saveLocalDbMemories(local);
        return data as DbMemory;
      }
    } catch (err) {
      console.warn(`Supabase updateMemory error for ${id}:`, err);
    }
  }

  const local = getLocalDbMemories();
  const existing = local.find((m) => m.id === id);
  if (!existing) {
    throw new Error(`Recuerdo con id ${id} no encontrado.`);
  }

  const updatedMem: DbMemory = { ...existing, ...payload };
  const newLocal = local.map((m) => (m.id === id ? updatedMem : m));
  saveLocalDbMemories(newLocal);
  return updatedMem;
}

/**
 * Elimina un recuerdo por su ID.
 */
export async function deleteMemory(id: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from('memories').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.warn(`Supabase deleteMemory error for ${id}:`, err);
    }
  }

  const local = getLocalDbMemories().filter((m) => m.id !== id);
  saveLocalDbMemories(local);
}

// ==============================================================================
// ADAPTERS: Mapeo bidireccional entre DbMemory y la UI Memory existente
// ==============================================================================

/**
 * Convierte un DbMemory (PostgreSQL) a la interfaz visual Memory esperada por los componentes.
 */
export function mapDbMemoryToUiMemory(
  dbMem: DbMemory,
  recipientName: string = 'Familia',
  recipientRelation: string = 'Círculo Familiar',
  mediaAssets: MediaAsset[] = []
): Memory {
  // Mapping type
  let memoryType: 'voz' | 'video' | 'carta' = 'carta';
  if (dbMem.memory_type === 'voice') memoryType = 'voz';
  else if (dbMem.memory_type === 'video') memoryType = 'video';
  else if (dbMem.memory_type === 'letter' || dbMem.memory_type === 'text') memoryType = 'carta';

  // Finding video or audio in media_assets if available
  const videoMedia = mediaAssets.find((m) => m.media_type === 'video');
  const audioMedia = mediaAssets.find((m) => m.media_type === 'audio');

  const durationFormatted = audioMedia?.duration_seconds 
    ? `${Math.floor(audioMedia.duration_seconds / 60)}:${(audioMedia.duration_seconds % 60).toString().padStart(2, '0')}`
    : videoMedia?.duration_seconds
      ? `${Math.floor(videoMedia.duration_seconds / 60)}:${(videoMedia.duration_seconds % 60).toString().padStart(2, '0')}`
      : memoryType === 'carta' ? 'Lectura 3 min' : '02:15';

  const previewText = dbMem.description || (dbMem.content ? dbMem.content.slice(0, 150) + '...' : 'Recuerdo resguardado');

  return {
    id: dbMem.id,
    dbId: dbMem.id,
    authorPersonId: dbMem.person_id,
    title: dbMem.title,
    memoryType,
    category: memoryType === 'carta' ? 'cartas' : memoryType === 'video' ? 'video' : 'audio',
    recipient: recipientName,
    recipientRelation,
    dateCreated: dbMem.created_at
      ? new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dbMem.created_at))
      : 'Reciente',
    releaseCondition: 'Custodia personal y testamentaria',
    preview: previewText,
    fullContent: dbMem.content || dbMem.description || 'Sin contenido textual.',
    duration: durationFormatted,
    status: dbMem.status === 'ready' ? 'Listo' : 'Cifrado',
    tags: [dbMem.category, memoryType.toUpperCase()],
    isLocked: dbMem.is_locked,
    securityLevel: dbMem.importance === 'critical' ? 'Alta Custodia' : 'Fecha Fija',
    hasVoiceNote: memoryType === 'voz',
    audioDuration: memoryType === 'voz' ? durationFormatted : undefined,
    videoDuration: memoryType === 'video' ? durationFormatted : undefined,
    videoThumbnail: videoMedia?.thumbnail_url || undefined,
    compatibility: {
      mobile: true,
      glasses: true,
    },
  };
}

/**
 * Convierte un recuerdo creado desde la UI hacia la entidad DbMemory para Supabase.
 */
export function mapUiMemoryToDbMemoryData(
  uiMem: Memory,
  authorPersonId: string
): Omit<DbMemory, 'id' | 'created_at' | 'updated_at'> {
  let dbType: DbMemoryType = 'letter';
  if (uiMem.memoryType === 'voz') dbType = 'voice';
  else if (uiMem.memoryType === 'video') dbType = 'video';

  let dbCategory: DbMemoryCategory = 'family';
  if (uiMem.tags.some((t) => t.toLowerCase().includes('amor'))) dbCategory = 'love';
  else if (uiMem.tags.some((t) => t.toLowerCase().includes('trabajo'))) dbCategory = 'work';
  else if (uiMem.tags.some((t) => t.toLowerCase().includes('consejo'))) dbCategory = 'advice';

  return {
    person_id: authorPersonId,
    title: uiMem.title,
    description: uiMem.preview,
    content: uiMem.fullContent,
    memory_type: dbType,
    category: dbCategory,
    event_date: null,
    location: null,
    importance: uiMem.securityLevel === 'Alta Custodia' ? 'critical' : 'normal',
    status: 'ready',
    is_locked: uiMem.isLocked,
  };
}
