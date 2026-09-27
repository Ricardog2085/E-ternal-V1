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
  videoDuration?: string;
  videoThumbnail?: string;
  compatibility: {
    mobile: boolean;
    glasses: boolean;
  };
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
