import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MediaAsset, MediaType } from '../types/eternal';
import { SEED_MEDIA_ASSETS } from '../data/seedData';

const LOCAL_STORAGE_MEDIA_KEY = 'eternal_media_assets_fase1';
const BUCKET_NAME = 'eternal-media';

function getLocalMediaAssets(): MediaAsset[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MEDIA_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading media assets from localStorage:', e);
  }
  return SEED_MEDIA_ASSETS;
}

function saveLocalMediaAssets(assets: MediaAsset[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_MEDIA_KEY, JSON.stringify(assets));
  } catch (e) {
    console.warn('Error saving media assets to localStorage:', e);
  }
}

/**
 * Registra los metadatos de un archivo multimedia en la tabla media_assets.
 */
export async function createMediaAsset(
  assetData: Omit<MediaAsset, 'id' | 'created_at'>
): Promise<MediaAsset> {
  const newId = crypto.randomUUID ? crypto.randomUUID() : `media-${Date.now()}`;
  const now = new Date().toISOString();

  const newAsset: MediaAsset = {
    id: newId,
    memory_id: assetData.memory_id,
    person_id: assetData.person_id || null,
    storage_path: assetData.storage_path,
    public_url: assetData.public_url || null,
    media_type: assetData.media_type,
    mime_type: assetData.mime_type || null,
    file_size: assetData.file_size || null,
    duration_seconds: assetData.duration_seconds || null,
    thumbnail_url: assetData.thumbnail_url || null,
    transcript: assetData.transcript || null,
    created_at: now,
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .insert([newAsset])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const local = getLocalMediaAssets();
        saveLocalMediaAssets([...local, data as MediaAsset]);
        return data as MediaAsset;
      }
    } catch (err) {
      console.warn('Supabase createMediaAsset error, saving locally:', err);
    }
  }

  const current = getLocalMediaAssets();
  saveLocalMediaAssets([...current, newAsset]);
  return newAsset;
}

/**
 * Obtiene todos los archivos multimedia asociados a un recuerdo específico.
 */
export async function getMediaAssetsByMemoryId(memoryId: string): Promise<MediaAsset[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .eq('memory_id', memoryId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) return data as MediaAsset[];
    } catch (err) {
      console.warn(`Supabase getMediaAssetsByMemoryId error for ${memoryId}:`, err);
    }
  }

  const local = getLocalMediaAssets();
  return local.filter((m) => m.memory_id === memoryId);
}

/**
 * Genera una URL firmada temporal para acceder a un archivo en el bucket privado.
 */
export async function getSignedUrl(
  storagePath: string,
  expiresInSeconds: number = 3600
): Promise<string | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(storagePath, expiresInSeconds);

    if (error) throw error;
    return data?.signedUrl || null;
  } catch (err) {
    console.warn(`Error generating signed URL for ${storagePath}:`, err);
    return null;
  }
}

/**
 * Sube un archivo binario a Supabase Storage en la ruta privada estructurada:
 * /people/{person_id}/memories/{memory_id}/{filename}
 */
export async function uploadMemoryMedia(
  personId: string,
  memoryId: string,
  file: Blob | File,
  mediaType: MediaType,
  customFilename?: string
): Promise<{ path: string; publicUrl?: string | null }> {
  const extension = file.type ? file.type.split('/')[1] || 'bin' : 'bin';
  const name = customFilename || `${mediaType}_${Date.now()}.${extension}`;
  const storagePath = `people/${personId}/memories/${memoryId}/${name}`;

  if (isSupabaseConfigured() && supabase) {
    try {
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || undefined,
        });

      if (uploadError) throw uploadError;

      // Intentamos obtener URL firmada inmediata para previsualización
      const signedUrl = await getSignedUrl(storagePath, 7200);

      // Creamos el registro en media_assets
      await createMediaAsset({
        memory_id: memoryId,
        person_id: personId,
        storage_path: storagePath,
        public_url: signedUrl,
        media_type: mediaType,
        mime_type: file.type || null,
        file_size: file.size,
      });

      return { path: storagePath, publicUrl: signedUrl };
    } catch (err) {
      console.warn('Supabase uploadMemoryMedia error:', err);
    }
  }

  // Fallback simulado para entorno local / preview sin credenciales de storage
  return { path: storagePath, publicUrl: null };
}
