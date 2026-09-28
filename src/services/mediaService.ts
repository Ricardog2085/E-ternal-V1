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

export interface UploadMemoryMediaParams {
  personId: string;
  memoryId: string;
  audioBlob: Blob;
  mimeType: string;
  durationSeconds?: number;
}

export interface UploadMemoryMediaResult {
  path: string;
  publicUrl: string;
  asset: MediaAsset;
}

/**
 * Función estricta requerida por FASE 1.5:
 * Sube el audio real grabado desde el micrófono a Supabase Storage y registra en public.media_assets.
 * No utiliza fallbacks locales: lanza error si cualquier paso falla.
 */
export async function uploadMemoryMediaToSupabase(
  params: UploadMemoryMediaParams
): Promise<UploadMemoryMediaResult> {
  const { personId, memoryId, audioBlob, mimeType, durationSeconds } = params;

  if (!isSupabaseConfigured() || !supabase) {
    throw new Error(
      'Supabase no está configurado. Por favor define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en Secrets de AI Studio para subir el audio real a Supabase Storage.'
    );
  }

  // Deducción de extensión de archivo según el mimeType real
  let extension = 'm4a';
  if (mimeType.includes('webm')) {
    extension = 'webm';
  } else if (mimeType.includes('ogg')) {
    extension = 'ogg';
  } else if (mimeType.includes('wav')) {
    extension = 'wav';
  } else if (mimeType.includes('mp3') || mimeType.includes('mpeg')) {
    extension = 'mp3';
  } else if (mimeType.includes('mp4') || mimeType.includes('aac')) {
    extension = 'm4a';
  }

  const filename = `audio_${Date.now()}.${extension}`;
  const storagePath = `people/${personId}/memories/${memoryId}/${filename}`;

  // 1. Subir a Supabase Storage en el bucket privado 'eternal-media'
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, audioBlob, {
      cacheControl: '3600',
      upsert: false,
      contentType: mimeType,
    });

  if (uploadError) {
    throw new Error(`Error en Supabase Storage (${BUCKET_NAME}): ${uploadError.message}`);
  }

  // 2. Generar signed URL privada (86400 seg = 24h)
  const { data: signedData, error: signedError } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, 86400);

  if (signedError || !signedData?.signedUrl) {
    throw new Error(`Error al generar Signed URL para el archivo: ${signedError?.message || 'Error desconocido'}`);
  }

  const publicUrl = signedData.signedUrl;

  // 3. Registrar metadatos en la tabla media_assets
  const assetPayload: Omit<MediaAsset, 'id' | 'created_at'> = {
    memory_id: memoryId,
    person_id: personId,
    storage_path: storagePath,
    public_url: publicUrl,
    media_type: 'audio',
    mime_type: mimeType,
    file_size: audioBlob.size,
    duration_seconds: durationSeconds ? Math.round(durationSeconds) : null,
    transcript: null,
  };

  const { data: assetData, error: assetError } = await supabase
    .from('media_assets')
    .insert([assetPayload])
    .select()
    .single();

  if (assetError || !assetData) {
    throw new Error(
      `El archivo se subió a Storage pero falló la inserción en la tabla media_assets: ${assetError?.message || 'Error desconocido'}`
    );
  }

  // Guardar en caché local para acceso offline
  const local = getLocalMediaAssets();
  saveLocalMediaAssets([assetData as MediaAsset, ...local]);

  return {
    path: storagePath,
    publicUrl,
    asset: assetData as MediaAsset,
  };
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
    const { data, error } = await supabase
      .from('media_assets')
      .insert([newAsset])
      .select()
      .single();

    if (error) {
      throw new Error(`Error registrando media_asset en Supabase: ${error.message}`);
    }
    if (data) {
      const local = getLocalMediaAssets();
      saveLocalMediaAssets([...local, data as MediaAsset]);
      return data as MediaAsset;
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
    const { data, error } = await supabase
      .from('media_assets')
      .select('*')
      .eq('memory_id', memoryId)
      .order('created_at', { ascending: true });

    if (error) {
      console.warn(`Supabase getMediaAssetsByMemoryId error for ${memoryId}:`, error.message);
    } else if (data) {
      return data as MediaAsset[];
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
