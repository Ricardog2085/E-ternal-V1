// ==========================================
// E-TERNAL DOMAIN & DATABASE TYPES (FASE 1)
// ==========================================

// ------------------------------------------
// 1. Database Schema Types (Supabase)
// ------------------------------------------

export type PersonStatus = 'active' | 'deceased' | 'archived';

export interface Person {
  id: string;
  user_id?: string | null;
  first_name: string;
  last_name?: string | null;
  display_name: string;
  birth_date?: string | null;
  death_date?: string | null;
  profile_photo_url?: string | null;
  bio?: string | null;
  status: PersonStatus;
  created_at?: string;
  updated_at?: string;
}

export type DbMemoryType = 
  | 'text' 
  | 'voice' 
  | 'video' 
  | 'letter' 
  | 'story' 
  | 'life_event' 
  | 'photo' 
  | 'special_message';

export type DbMemoryCategory = 
  | 'family' 
  | 'childhood' 
  | 'love' 
  | 'work' 
  | 'life_lesson' 
  | 'humor' 
  | 'tradition' 
  | 'important_event' 
  | 'advice' 
  | 'personal' 
  | 'special_message' 
  | 'legacy';

export type MemoryImportance = 'low' | 'normal' | 'high' | 'critical';

export type DbMemoryStatus = 'draft' | 'ready' | 'archived';

export interface DbMemory {
  id: string;
  person_id: string;
  title: string;
  description?: string | null;
  content?: string | null;
  memory_type: DbMemoryType;
  category: DbMemoryCategory;
  event_date?: string | null;
  location?: string | null;
  importance: MemoryImportance;
  status: DbMemoryStatus;
  is_locked: boolean;
  created_at?: string;
  updated_at?: string;
}

export type MediaType = 'photo' | 'audio' | 'video';

export interface MediaAsset {
  id: string;
  memory_id: string;
  person_id?: string | null;
  storage_path: string;
  public_url?: string | null;
  media_type: MediaType;
  mime_type?: string | null;
  file_size?: number | null;
  duration_seconds?: number | null;
  thumbnail_url?: string | null;
  transcript?: string | null;
  created_at?: string;
}

export interface MemoryPerson {
  id: string;
  memory_id: string;
  person_id: string;
  relationship_context?: string | null;
  created_at?: string;
}

// ------------------------------------------
// 2. UI Compatibility Types (V1 Preserved)
// ------------------------------------------

export type MemoryType = 'voz' | 'video' | 'carta';
export type MemoryCategory = 'cartas' | 'audio' | 'video' | 'sabiduria' | 'legado';

export interface Memory {
  id: string;
  title: string;
  memoryType: MemoryType;
  category: MemoryCategory;
  recipient: string;
  recipientRelation: string;
  dateCreated: string;
  releaseCondition: string;
  releaseDate?: string;
  preview: string;
  fullContent: string;
  duration: string;
  status: 'Cifrado' | 'Listo' | 'Custodiado';
  tags: string[];
  isLocked: boolean;
  securityLevel: 'Alta Custodia' | 'Doble Llave' | 'Fecha Fija' | 'Inmediata';
  hasVoiceNote?: boolean;
  audioDuration?: string;
  audioUrl?: string;
  videoDuration?: string;
  videoThumbnail?: string;
  compatibility: {
    mobile: boolean;
    glasses: boolean;
  };
  // Reference to new DB id if synced
  dbId?: string;
  authorPersonId?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  email: string;
  phone?: string;
  isCustodian: boolean;
  custodianRole?: 'Custodio Primario' | 'Custodio Testigo' | 'Albacea Digital';
  assignedMemoriesCount: number;
  status: 'Activo' | 'Verificado' | 'Pendiente de Aceptación';
  avatarInitials: string;
  avatarColor?: string;
  note?: string;
  // Reference to Person in DB
  personId?: string;
}

export interface DeliverySchedule {
  id: string;
  memoryId: string;
  memoryTitle: string;
  recipientName: string;
  relation: string;
  triggerType: 'fecha' | 'hito' | 'custodia_dual' | 'latido_inactividad';
  triggerLabel: string;
  scheduledYear: number;
  scheduledDateFormatted: string;
  daysRemaining?: number;
  status: 'Programada' | 'En espera de hito' | 'Verificación en curso' | 'Entregada';
  custodiansRequired: number;
  custodiansConfirmed: number;
}

export interface AvatarMessage {
  id: string;
  sender: 'user' | 'avatar';
  text: string;
  timestamp: string;
  sourceMemoryTitle?: string;
}

export interface LifePrinciple {
  id: string;
  category: 'Amor & Familia' | 'Trabajo & Esfuerzo' | 'Dificultades' | 'Espiritualidad';
  quote: string;
  context: string;
}
