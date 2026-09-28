import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Volume2, 
  Video, 
  Feather, 
  Lock, 
  Eye, 
  Clock, 
  Smartphone, 
  Glasses, 
  User, 
  Trash2, 
  Sparkles 
} from 'lucide-react';
import { Memory, FamilyMember } from '../types/eternal';
import { MemoryReaderModal } from './MemoryReaderModal';
import { NewMemoryModal } from './NewMemoryModal';

interface BovedaTabProps {
  memories: Memory[];
  onAddMemory: (
    newMem: Memory,
    audioBlob?: Blob,
    audioMimeType?: string,
    durationSeconds?: number
  ) => Promise<void> | void;
  onDeleteMemory: (id: string) => void;
  familyMembers?: FamilyMember[];
}

export const BovedaTab: React.FC<BovedaTabProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory,
  familyMembers = [],
}) => {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  const toggleAudioPlay = (mem: Memory, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingAudioId === mem.id) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      setPlayingAudioId(null);
    } else {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      if (mem.audioUrl) {
        const audio = new Audio(mem.audioUrl);
        audio.onended = () => setPlayingAudioId(null);
        audio.play().catch((err) => console.warn('Audio play error:', err));
        currentAudioRef.current = audio;
      }
      setPlayingAudioId(mem.id);
    }
  };

  const filteredMemories = memories.filter((mem) => {
    const matchesType = selectedTypeFilter === 'todos' || mem.memoryType === selectedTypeFilter;
    const matchesSearch =
      mem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8 py-2">
      {/* Editorial Header with "+ Nuevo Recuerdo" button on top right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#EFE8DE]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#A88720]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>Bóveda Personal & Custodia Criptográfica</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C241E] tracking-tight">
            Bóveda de Recuerdos
          </h1>
          <p className="text-[#6B5E55] text-sm font-sans max-w-xl">
            Tus testimonios resguardados con protocolo inalterable, listos para trascender en el tiempo.
          </p>
        </div>

        {/* BOTÓN + NUEVO RECUERDO ARRIBA A LA DERECHA */}
        <div className="flex-shrink-0">
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-[#D4AF37] text-white hover:bg-[#C59B27] border border-[#D4AF37] shadow-gold-subtle transition-all duration-300 font-medium text-sm group"
          >
            <Plus className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-90" />
            <span className="font-editorial font-semibold tracking-wide">+ Nuevo Recuerdo</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Type filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'voz', label: 'Voz con Waveform' },
            { id: 'video', label: 'Video Preview' },
            { id: 'carta', label: 'Cartas con Texto' },
          ].map((tab) => {
            const isSelected = selectedTypeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTypeFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#D4AF37] text-white border border-[#D4AF37] shadow-xs font-semibold'
                    : 'bg-white text-[#6B5E55] hover:text-[#2C241E] hover:bg-[#FAF7F2] border border-[#E8DEC8]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
          <input
            type="text"
            placeholder="Buscar por Sofía, Mamá, Carlos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-white border border-[#E8DEC8] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-[#2C241E] placeholder:text-[#9E9187] shadow-xs"
          />
        </div>
      </div>

      {/* GRID DE 2 COLUMNAS DE RECUERDOS (Obligatorio) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMemories.map((mem) => {
          const isAudioActive = playingAudioId === mem.id;

          return (
            <div
              key={mem.id}
              onClick={() => setActiveMemory(mem)}
              className="group bg-white rounded-2xl p-6 border border-[#EFE8DE] hover:border-[#D4AF37]/80 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden"
            >
              {/* Subtle top indicator bar */}
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-transparent group-hover:bg-[#D4AF37] transition-colors" />

              <div className="space-y-4">
                
                {/* TOP METADATA ROW: Destinatario, Estado Cifrado, Fecha e Iconitos 📱 y 👓 */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  {/* Destinatario */}
                  <div className="flex items-center space-x-1.5 font-medium">
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="text-[#2C241E] font-semibold text-sm font-editorial">
                      {mem.recipient}
                    </span>
                    <span className="text-[#8C7A6B] text-xs">({mem.recipientRelation})</span>
                  </div>

                  {/* Estado Cifrado + Fecha + Iconitos 📱 👓 */}
                  <div className="flex items-center space-x-2">
                    {/* ESTADO CIFRADO */}
                    <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-[#8C6D1F] bg-[#FAF7F2] px-2 py-0.5 rounded-lg border border-[#D4AF37]/40 shadow-xs">
                      <Lock className="w-3 h-3 text-[#D4AF37]" />
                      <span>{mem.status || 'Cifrado'}</span>
                    </span>

                    {/* FECHA */}
                    <span className="text-[11px] text-[#8C7A6B] font-sans">
                      {mem.dateCreated}
                    </span>

                    {/* ICONITOS PEQUEÑOS 📱 y 👓 PARA COMPATIBILIDAD */}
                    <div className="flex items-center space-x-1 pl-1.5 border-l border-[#EFE8DE] text-xs text-[#6B5E55]">
                      <span 
                        title="Compatible con Celular (hoy)" 
                        className="cursor-help hover:scale-110 transition-transform inline-block"
                      >
                        📱
                      </span>
                      <span 
                        title="Compatible con Gafas Inteligentes (mañana)" 
                        className="cursor-help hover:scale-110 transition-transform inline-block"
                      >
                        👓
                      </span>
                    </div>
                  </div>
                </div>

                {/* TÍTULO EN GEORGIA SERIF */}
                <div className="space-y-1">
                  <h3 className="font-editorial text-xl font-bold text-[#2C241E] leading-snug group-hover:text-[#A88720] transition-colors">
                    {mem.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-[11px] text-[#8C7A6B]">
                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                    <span>Duración: <strong className="text-[#2C241E] font-mono">{mem.duration}</strong></span>
                    <span>·</span>
                    <span className="capitalize text-[#6B5E55] font-medium">Tipo: {mem.memoryType}</span>
                  </div>
                </div>

                {/* VISUAL REPRESENTATION BASED ON TYPE (Voz con Waveform, Video con Preview, Carta con Texto) */}
                
                {/* 1. TIPO VOZ CON WAVEFORM */}
                {mem.memoryType === 'voz' && (
                  <div 
                    onClick={(e) => toggleAudioPlay(mem, e)}
                    className="p-4 rounded-xl bg-[#FAF7F2] text-[#2C241E] border border-[#D4AF37]/40 shadow-xs space-y-2.5 transition-all group-hover:border-[#D4AF37]/80 cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 text-[#A88720]">
                        <Volume2 className="w-4 h-4" />
                        <span className="font-semibold text-[11px] uppercase tracking-wider">Nota de Voz Acústica</span>
                      </div>
                      <span className="font-mono text-[#6B5E55] text-xs">{mem.duration}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={(e) => toggleAudioPlay(mem, e)}
                        className="w-8 h-8 rounded-full bg-[#D4AF37] text-white flex items-center justify-center flex-shrink-0 hover:bg-[#C59B27] transition-transform hover:scale-105 shadow-xs"
                      >
                        {playingAudioId === mem.id ? (
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        )}
                      </button>

                      {/* Waveform bars */}
                      <div className="flex-1 flex items-center space-x-1 h-6">
                        {[20, 45, 75, 90, 60, 35, 80, 95, 85, 40, 65, 90, 70, 50, 85, 95, 60, 40, 75, 50, 30, 20].map((bar, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 rounded-full transition-all duration-200 ${
                              playingAudioId === mem.id ? 'bg-[#D4AF37]' : 'bg-[#D8C9B4]'
                            }`}
                            style={{ height: `${playingAudioId === mem.id ? bar : Math.max(18, bar * 0.7)}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. TIPO VIDEO CON PREVIEW */}
                {mem.memoryType === 'video' && (
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-[#FAF7F2] border border-[#E8DEC8] group/video shadow-xs">
                    {mem.videoThumbnail ? (
                      <img
                        src={mem.videoThumbnail}
                        alt={mem.title}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#FAF7F2] via-[#F3ECE2] to-[#EAE0D2] flex items-center justify-center text-[#8C7A6B]">
                        <Video className="w-10 h-10 text-[#D4AF37]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2C241E]/70 via-transparent to-transparent" />
                    
                    {/* Play Badge */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-white/95 backdrop-blur-xs border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center shadow-soft group-hover/video:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="flex items-center space-x-1 text-[11px] bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                        <Video className="w-3 h-3 text-[#D4AF37]" />
                        <span>Video Selfie / POV</span>
                      </span>
                      <span className="font-mono text-xs bg-black/50 px-2 py-0.5 rounded text-[#D4AF37]">
                        {mem.duration}
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. TIPO CARTA CON TEXTO */}
                {mem.memoryType === 'carta' && (
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#D4AF37]/35 shadow-xs relative">
                    <div className="flex items-center space-x-1.5 text-xs text-[#2C241E] font-semibold mb-2">
                      <Feather className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="font-editorial uppercase tracking-wider text-[11px]">Manuscrito Editorial</span>
                    </div>
                    <div className="font-editorial text-sm text-[#4A3E34] italic leading-relaxed line-clamp-2">
                      "{mem.preview}"
                    </div>
                  </div>
                )}

                {/* PREVIEW CORTO EMOTIVO (Para voz y video también como cita) */}
                {mem.memoryType !== 'carta' && (
                  <p className="text-xs text-[#6B5E55] leading-relaxed font-sans line-clamp-2 italic">
                    "{mem.preview}"
                  </p>
                )}

              </div>

              {/* CARD FOOTER */}
              <div className="pt-4 mt-4 border-t border-[#EFE8DE] flex items-center justify-between">
                <div className="text-[11px] text-[#8C7A6B]">
                  Condición: <span className="text-[#2C241E] font-medium">{mem.releaseCondition}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteMemory(mem.id);
                    }}
                    title="Eliminar de la bóveda"
                    className="p-1.5 text-[#A89A8F] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setActiveMemory(mem)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white text-[#2C241E] hover:bg-[#FAF7F2] text-xs font-semibold transition-colors border border-[#D4AF37]/60 shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Abrir</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Reader Modal */}
      <MemoryReaderModal
        memory={activeMemory}
        onClose={() => setActiveMemory(null)}
      />

      {/* New Memory Modal */}
      <NewMemoryModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={onAddMemory}
        familyMembers={familyMembers}
      />
    </div>
  );
};
