import React from 'react';
import { 
  User, 
  ShieldCheck, 
  Archive, 
  Clock, 
  Users, 
  Sparkles, 
  BookOpen, 
  Volume2, 
  Calendar, 
  Key, 
  Lock, 
  Feather, 
  ChevronRight,
  Heart,
  Fingerprint
} from 'lucide-react';
import { Person, Memory, FamilyMember, DeliverySchedule } from '../types/eternal';

interface PersonaPerfilTabProps {
  person: Person | null;
  memories: Memory[];
  familyMembers: FamilyMember[];
  deliveries: DeliverySchedule[];
  onNavigate: (tab: 'perfil' | 'historia' | 'recuerdos' | 'multimedia' | 'familia' | 'entregas' | 'futuro') => void;
  onOpenNewMemory: () => void;
}

export const PersonaPerfilTab: React.FC<PersonaPerfilTabProps> = ({
  person,
  memories,
  familyMembers,
  deliveries,
  onNavigate,
  onOpenNewMemory,
}) => {
  const displayName = person?.display_name || 'Enrique Morales';
  const bio = person?.bio || 'Artesano de la memoria, padre de familia y custodio de un legado destinado a perdurar con dignidad a través de las generaciones.';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('') || 'EM';

  const audioMemoriesCount = memories.filter((m) => m.memoryType === 'voz' || m.hasVoiceNote).length;
  const letterMemoriesCount = memories.filter((m) => m.memoryType === 'carta').length;
  const videoMemoriesCount = memories.filter((m) => m.memoryType === 'video').length;

  return (
    <div className="space-y-10 py-2 animate-fadeIn">
      {/* Editorial Header / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFE8DE]">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#A88720]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>Estructura de Persona & Identidad de Bóveda</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C241E] tracking-tight">
            Perfil del Titular
          </h1>
          <p className="text-[#6B5E55] text-sm font-sans max-w-2xl">
            Toda la arquitectura de recuerdos, custodios y mensajes futuros emana de una única identidad humana protegida.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenNewMemory}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#D4AF37] text-white hover:bg-[#C59B27] border border-[#D4AF37] shadow-gold-subtle text-xs font-semibold transition-all"
          >
            <Feather className="w-4 h-4" />
            <span>+ Crear Nuevo Recuerdo</span>
          </button>
        </div>
      </div>

      {/* Hero Card del Titular */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE8DE] shadow-soft relative overflow-hidden">
        {/* Subtle decorative gold badge in background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#D4AF37]/10 via-transparent to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 relative z-10">
          {/* Avatar emblem */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#FAF7F2] via-[#F3ECE2] to-[#EAE0D2] border-2 border-[#D4AF37] shadow-soft flex items-center justify-center text-3xl sm:text-4xl font-editorial font-bold text-[#947113]">
              {initials}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-xl border-2 border-white shadow-xs" title="Bóveda activa">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#2C241E]">
                {displayName}
              </h2>
              <span className="text-[11px] font-semibold text-[#8C6D1F] bg-[#FAF7F2] px-2.5 py-1 rounded-xl border border-[#D4AF37]/50 shadow-xs flex items-center space-x-1">
                <Fingerprint className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Titular Acreditado · Supabase RLS</span>
              </span>
            </div>

            <p className="text-sm text-[#4A3E34] font-editorial leading-relaxed max-w-3xl">
              "{bio}"
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B5E55] pt-1">
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Origen: 14 Octubre 1952 (Salamanca)</span>
              </span>
              <span>·</span>
              <span className="flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Custodia: Cifrado con Doble Llave</span>
              </span>
              <span>·</span>
              <span className="flex items-center space-x-1.5 text-emerald-800 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bóveda Activa e Inalterable</span>
              </span>
            </div>
          </div>
        </div>

        {/* 4 Metric Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#EFE8DE]">
          <div 
            onClick={() => onNavigate('recuerdos')}
            className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC8] hover:border-[#D4AF37] transition-all cursor-pointer group"
          >
            <div className="text-[11px] font-medium text-[#6B5E55] uppercase tracking-wider flex items-center justify-between">
              <span>Recuerdos</span>
              <Archive className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-editorial text-2xl font-bold text-[#2C241E] mt-1">
              {memories.length}
            </div>
            <div className="text-[11px] text-[#8C7A6B] mt-0.5">
              Entidades independientes
            </div>
          </div>

          <div 
            onClick={() => onNavigate('multimedia')}
            className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC8] hover:border-[#D4AF37] transition-all cursor-pointer group"
          >
            <div className="text-[11px] font-medium text-[#6B5E55] uppercase tracking-wider flex items-center justify-between">
              <span>Grabaciones & Audio</span>
              <Volume2 className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-editorial text-2xl font-bold text-[#2C241E] mt-1">
              {audioMemoriesCount}
            </div>
            <div className="text-[11px] text-[#8C7A6B] mt-0.5">
              Capturas de micrófono real
            </div>
          </div>

          <div 
            onClick={() => onNavigate('familia')}
            className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC8] hover:border-[#D4AF37] transition-all cursor-pointer group"
          >
            <div className="text-[11px] font-medium text-[#6B5E55] uppercase tracking-wider flex items-center justify-between">
              <span>Custodios</span>
              <Users className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-editorial text-2xl font-bold text-[#2C241E] mt-1">
              {familyMembers.length}
            </div>
            <div className="text-[11px] text-[#8C7A6B] mt-0.5">
              Familiares autorizados
            </div>
          </div>

          <div 
            onClick={() => onNavigate('entregas')}
            className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC8] hover:border-[#D4AF37] transition-all cursor-pointer group"
          >
            <div className="text-[11px] font-medium text-[#6B5E55] uppercase tracking-wider flex items-center justify-between">
              <span>Entregas</span>
              <Clock className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-editorial text-2xl font-bold text-[#2C241E] mt-1">
              {deliveries.length}
            </div>
            <div className="text-[11px] text-[#8C7A6B] mt-0.5">
              Hitos vitales programados
            </div>
          </div>
        </div>
      </div>

      {/* ESTRUCTURA CONCEPTUAL DE LA PERSONA */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-editorial text-2xl font-bold text-[#2C241E]">
            Arquitectura de Legado de la Persona
          </h3>
          <p className="text-xs text-[#6B5E55]">
            Cada recuerdo, archivo de audio y entrega está anclado a {displayName}, estructurado en ramas autónomas:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Rama 1: Historia & Origen */}
          <div 
            onClick={() => onNavigate('historia')}
            className="p-6 rounded-2xl bg-white border border-[#EFE8DE] hover:border-[#D4AF37] shadow-soft transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-[#2C241E] group-hover:text-[#A88720] transition-colors flex items-center justify-between">
              <span>1. Historia / Inicio</span>
              <ChevronRight className="w-4 h-4 text-[#8C7A6B] group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-[#6B5E55] leading-relaxed">
              Cronología vital, momentos formativos y testimonios esenciales de los años tempranos.
            </p>
            <div className="text-[11px] font-semibold text-[#A88720] pt-1">
              Explorar línea de vida →
            </div>
          </div>

          {/* Rama 2: Recuerdos Independientes */}
          <div 
            onClick={() => onNavigate('recuerdos')}
            className="p-6 rounded-2xl bg-white border border-[#EFE8DE] hover:border-[#D4AF37] shadow-soft transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
              <Archive className="w-5 h-5" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-[#2C241E] group-hover:text-[#A88720] transition-colors flex items-center justify-between">
              <span>2. Bóveda de Recuerdos</span>
              <ChevronRight className="w-4 h-4 text-[#8C7A6B] group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-[#6B5E55] leading-relaxed">
              {memories.length} entidades autónomas (cartas, notas de voz, lecciones de vida y testimonios) con custodia individual.
            </p>
            <div className="text-[11px] font-semibold text-[#A88720] pt-1">
              Ver recuerdos individuales →
            </div>
          </div>

          {/* Rama 3: Multimedia & Audio Real */}
          <div 
            onClick={() => onNavigate('multimedia')}
            className="p-6 rounded-2xl bg-white border border-[#EFE8DE] hover:border-[#D4AF37] shadow-soft transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
              <Volume2 className="w-5 h-5" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-[#2C241E] group-hover:text-[#A88720] transition-colors flex items-center justify-between">
              <span>3. Galería Multimedia</span>
              <ChevronRight className="w-4 h-4 text-[#8C7A6B] group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-[#6B5E55] leading-relaxed">
              Audios reales grabados con el micrófono del iPhone, metadatos de Storage y reproductor individual sin compresión destructiva.
            </p>
            <div className="text-[11px] font-semibold text-[#A88720] pt-1">
              Escuchar audios grabados →
            </div>
          </div>

          {/* Rama 4: Familia & Custodios */}
          <div 
            onClick={() => onNavigate('familia')}
            className="p-6 rounded-2xl bg-white border border-[#EFE8DE] hover:border-[#D4AF37] shadow-soft transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-[#2C241E] group-hover:text-[#A88720] transition-colors flex items-center justify-between">
              <span>4. Familia & Custodia</span>
              <ChevronRight className="w-4 h-4 text-[#8C7A6B] group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-[#6B5E55] leading-relaxed">
              Círculo de afectos, albaceas digitales y asignación de recuerdos por destinatario.
            </p>
            <div className="text-[11px] font-semibold text-[#A88720] pt-1">
              Administrar círculo familiar →
            </div>
          </div>

          {/* Rama 5: Entregas Programadas */}
          <div 
            onClick={() => onNavigate('entregas')}
            className="p-6 rounded-2xl bg-white border border-[#EFE8DE] hover:border-[#D4AF37] shadow-soft transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-[#2C241E] group-hover:text-[#A88720] transition-colors flex items-center justify-between">
              <span>5. Calendario de Entregas</span>
              <ChevronRight className="w-4 h-4 text-[#8C7A6B] group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-[#6B5E55] leading-relaxed">
              Desbloqueo gradual vinculado a fechas calendarias e hitos de mayoría de edad o bodas.
            </p>
            <div className="text-[11px] font-semibold text-[#A88720] pt-1">
              Ver calendario de liberación →
            </div>
          </div>

          {/* Rama 6: Conversación Futura */}
          <div 
            onClick={() => onNavigate('futuro')}
            className="p-6 rounded-2xl bg-white border border-[#EFE8DE] hover:border-[#D4AF37] shadow-soft transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-[#2C241E] group-hover:text-[#A88720] transition-colors flex items-center justify-between">
              <span>6. Conversación Futura</span>
              <ChevronRight className="w-4 h-4 text-[#8C7A6B] group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-[#6B5E55] leading-relaxed">
              Diálogo interactivo alimentado exclusivamente por los recuerdos y principios morales del titular.
            </p>
            <div className="text-[11px] font-semibold text-[#A88720] pt-1">
              Entrar en modo legado →
            </div>
          </div>
        </div>
      </div>

      {/* Protocolo de Seguridad & Privacidad */}
      <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#EFE8DE] space-y-4">
        <div className="flex items-center space-x-3 text-[#A88720]">
          <Lock className="w-5 h-5" />
          <h3 className="font-editorial text-lg font-bold text-[#2C241E]">
            Garantía de Inviolabilidad Privada
          </h3>
        </div>
        <p className="text-xs text-[#6B5E55] leading-relaxed font-sans max-w-4xl">
          E-Ternal no es una red social pública. Cada registro de audio, carta y metadato está protegido por políticas Row Level Security (RLS) en Supabase vinculadas al identificador del titular (`auth.uid() = user_id`). El bucket de Storage `eternal-media` permanece estricta y perpetuamente privado, requiriendo URLs firmadas para cualquier reproducción.
        </p>
      </div>
    </div>
  );
};
