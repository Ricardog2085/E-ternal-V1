import React from 'react';
import { 
  BookOpen, 
  Calendar, 
  MapPin, 
  Feather, 
  Clock, 
  ChevronRight, 
  Heart, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { Memory } from '../types/eternal';

interface HistoriaTabProps {
  memories: Memory[];
  onOpenMemory: (memory: Memory) => void;
  onNavigateToRecuerdos: () => void;
}

interface LifeMilestone {
  year: string;
  age: string;
  title: string;
  location: string;
  description: string;
  quote: string;
  linkedMemoryTitle?: string;
  tag: string;
}

const LIFE_MILESTONES: LifeMilestone[] = [
  {
    year: '1952',
    age: 'Nacimiento',
    title: 'Origen y Raíces Castellanas',
    location: 'Salamanca, España',
    description: 'Nacido en el seno de una familia de maestros artesanos. De mi padre aprendí el valor del trabajo bien ejecutado sin prisas y de mi madre la templanza ante las dificultades.',
    quote: 'La dignidad no se hereda en títulos, se forja en el silencio de cada jornada honesta.',
    tag: 'Infancia & Principios',
  },
  {
    year: '1974',
    age: '22 años',
    title: 'El Encuentro con Carmen',
    location: 'Plaza Mayor de Salamanca',
    description: 'Una tarde de primavera, bajo los soportales. Un libro de versos caído al suelo y una conversación que transformó el resto de mi existencia. Carmen fue mi brújula y el ancla serena de nuestro hogar.',
    quote: 'Amar no es mirarse el uno al otro, sino mirar juntos en la misma dirección sin vacilar.',
    linkedMemoryTitle: 'Carta para Elena: 30 Años de Matrimonio',
    tag: 'Amor & Matrimonio',
  },
  {
    year: '1985',
    age: '33 años',
    title: 'Fundación del Taller Familiar',
    location: 'Madrid, España',
    description: 'Primeros años de esfuerzo independiente. Jornadas largas donde el compromiso con la palabra dada valía más que cualquier contrato redactado por letrados.',
    quote: 'Tu nombre y tu reputación son la única herencia que el fuego ni el tiempo pueden arrebatarte.',
    linkedMemoryTitle: 'El Significado del Trabajo Bien Hecho',
    tag: 'Esfuerzo & Vocación',
  },
  {
    year: '1998',
    age: '46 años',
    title: 'El Nacimiento de Sofía y la Plenitud',
    location: 'Madrid, España',
    description: 'La llegada de la hija menor abrió una nueva dimensión de ternura y reflexión sobre la fragilidad del tiempo. Comprendí que el verdadero legado no son las posesiones materiales, sino las palabras oportunas en los momentos de soledad.',
    quote: 'Cuando dudes de ti misma, recuerda que tu apellido lleva la sangre de quienes nunca se rindieron.',
    linkedMemoryTitle: 'Para Sofía: El Día de Tu Boda',
    tag: 'Paternidad',
  },
  {
    year: '2024+',
    age: 'Presente',
    title: 'Custodia Sagrada en E-Ternal',
    location: 'Bóveda Criptográfica E-Ternal',
    description: 'El inicio del resguardo sistemático de memorias, audios auténticos y cartas selladas para acompañar a las generaciones venideras cuando la presencia física sea silencio.',
    quote: 'Trascender es dejar una luz encendida en la memoria de los que continúan el viaje.',
    tag: 'Legado Eterno',
  },
];

export const HistoriaTab: React.FC<HistoriaTabProps> = ({
  memories,
  onOpenMemory,
  onNavigateToRecuerdos,
}) => {
  return (
    <div className="space-y-10 py-2 animate-fadeIn">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFE8DE]">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#A88720]">
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Persona · Historia & Trayectoria Vital</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C241E] tracking-tight">
            Historia & Línea de Vida
          </h1>
          <p className="text-[#6B5E55] text-sm font-sans max-w-2xl">
            La memoria no es un archivo inconexo; es el hilo cronológico de una vida entera ofrecida a quienes vendrán después.
          </p>
        </div>

        <button
          onClick={onNavigateToRecuerdos}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-white border border-[#E8DEC8] hover:border-[#D4AF37] text-xs font-semibold text-[#2C241E] shadow-xs hover:shadow-soft transition-all"
        >
          <span>Ver todos los recuerdos</span>
          <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
        </button>
      </div>

      {/* Introducción Editorial */}
      <div className="p-8 rounded-3xl bg-white border border-[#EFE8DE] shadow-soft relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#A88720] uppercase tracking-wider">
            <Feather className="w-4 h-4" />
            <span>Génesis del Legado</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#2C241E] leading-snug">
            "Todo lo que amamos merece una memoria que no dependa del olvido."
          </h2>
          <p className="text-sm text-[#4A3E34] font-editorial leading-relaxed">
            Aquí se compila la historia viva de Enrique Morales. Cada hito marca el nacimiento de una lección, una carta o una nota de voz que hoy descansa en la bóveda, lista para ser liberada en el instante preciso de la vida de sus hijos y nietos.
          </p>
        </div>
      </div>

      {/* CRONOLOGÍA / LÍNEA DE VIDA */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-[#D4AF37] via-[#D4AF37]/40 before:to-transparent">
        {LIFE_MILESTONES.map((milestone, idx) => {
          // Buscar si existe un recuerdo relacionado en el estado de memorias
          const linkedMemory = milestone.linkedMemoryTitle
            ? memories.find((m) => m.title.toLowerCase().includes(milestone.linkedMemoryTitle!.toLowerCase().slice(0, 15)))
            : undefined;

          return (
            <div key={idx} className="relative group">
              {/* Dot en la línea de tiempo */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-6 w-5 h-5 rounded-full bg-white border-2 border-[#D4AF37] flex items-center justify-center shadow-xs group-hover:scale-125 transition-transform">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              </div>

              {/* Card del Hito */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EFE8DE] group-hover:border-[#D4AF37] shadow-soft transition-all space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[#A88720] text-sm bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#D4AF37]/30">
                      {milestone.year}
                    </span>
                    <span className="text-[#8C7A6B]">({milestone.age})</span>
                    <span>·</span>
                    <span className="flex items-center space-x-1 text-[#6B5E55]">
                      <MapPin className="w-3 h-3 text-[#D4AF37]" />
                      <span>{milestone.location}</span>
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-[#6B5E55] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E8DEC8]">
                    {milestone.tag}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#2C241E] group-hover:text-[#A88720] transition-colors">
                    {milestone.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4A3E34] font-sans leading-relaxed">
                    {milestone.description}
                  </p>
                </div>

                {/* Cita testimonial */}
                <div className="p-4 rounded-xl bg-[#FAF7F2] border-l-2 border-[#D4AF37] text-xs sm:text-sm font-editorial italic text-[#2C241E]">
                  "{milestone.quote}"
                </div>

                {/* Recuerdo Vinculado si existe */}
                {linkedMemory && (
                  <div className="pt-2 flex items-center justify-between border-t border-[#EFE8DE]">
                    <div className="text-xs text-[#6B5E55] flex items-center space-x-1.5">
                      <Feather className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Recuerdo asociado: <strong className="text-[#2C241E]">{linkedMemory.title}</strong></span>
                    </div>

                    <button
                      onClick={() => onOpenMemory(linkedMemory)}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-[#A88720] hover:text-[#947113] transition-colors"
                    >
                      <span>Abrir recuerdo</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
