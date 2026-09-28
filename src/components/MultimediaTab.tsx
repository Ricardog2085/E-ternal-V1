import React, { useState } from 'react';
import { 
  Volume2, 
  Video, 
  Feather, 
  Play, 
  Pause, 
  Search, 
  Calendar, 
  User, 
  Lock, 
  HardDrive, 
  FileText, 
  ExternalLink,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { Memory } from '../types/eternal';

interface MultimediaTabProps {
  memories: Memory[];
  onOpenMemory: (memory: Memory) => void;
  onOpenNewMemory: () => void;
}

export const MultimediaTab: React.FC<MultimediaTabProps> = ({
  memories,
  onOpenMemory,
  onOpenNewMemory,
}) => {
  const [filterType, setFilterType] = useState<'todos' | 'audio' | 'video' | 'manuscrito'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar memorias que contienen activos multimedia (audios grabados, videos, o cartas)
  const mediaMemories = memories.filter((mem) => {
    const isAudio = mem.memoryType === 'voz' || Boolean(mem.hasVoiceNote || mem.audioUrl);
    const isVideo = mem.memoryType === 'video' || Boolean(mem.videoThumbnail);
    const isLetter = mem.memoryType === 'carta';

    if (filterType === 'audio' && !isAudio) return false;
    if (filterType === 'video' && !isVideo) return false;
    if (filterType === 'manuscrito' && !isLetter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        mem.title.toLowerCase().includes(q) ||
        mem.recipient.toLowerCase().includes(q) ||
        mem.releaseCondition.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const totalAudios = memories.filter((m) => m.memoryType === 'voz' || m.hasVoiceNote || m.audioUrl).length;
  const totalVideos = memories.filter((m) => m.memoryType === 'video' || m.videoThumbnail).length;
  const totalLetters = memories.filter((m) => m.memoryType === 'carta').length;

  return (
    <div className="space-y-8 py-2 animate-fadeIn">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFE8DE]">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#A88720]">
            <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Persona · Repositorio Multimedia & Grabaciones de Voz</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C241E] tracking-tight">
            Multimedia del Legado
          </h1>
          <p className="text-[#6B5E55] text-sm font-sans max-w-2xl">
            Grabaciones auténticas de voz del titular, documentos y registros audiovisuales protegidos bajo protocolo privado.
          </p>
        </div>

        <button
          onClick={onOpenNewMemory}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#D4AF37] text-white hover:bg-[#C59B27] border border-[#D4AF37] shadow-gold-subtle text-xs font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Grabar Nueva Nota de Voz</span>
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setFilterType('audio')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterType === 'audio' 
              ? 'bg-[#FAF7F2] border-[#D4AF37] shadow-xs' 
              : 'bg-white border-[#E8DEC8] hover:border-[#D4AF37]'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[#6B5E55]">
            <span className="font-medium">Grabaciones de Voz</span>
            <Volume2 className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="font-editorial text-2xl font-bold text-[#2C241E] mt-1">
            {totalAudios}
          </div>
          <div className="text-[11px] text-[#8C7A6B]">
            Micrófono real · Alta fidelidad
          </div>
        </div>

        <div 
          onClick={() => setFilterType('video')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterType === 'video' 
              ? 'bg-[#FAF7F2] border-[#D4AF37] shadow-xs' 
              : 'bg-white border-[#E8DEC8] hover:border-[#D4AF37]'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[#6B5E55]">
            <span className="font-medium">Videos y POV</span>
            <Video className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="font-editorial text-2xl font-bold text-[#2C241E] mt-1">
            {totalVideos}
          </div>
          <div className="text-[11px] text-[#8C7A6B]">
            Compatible con Celular y Gafas
          </div>
        </div>

        <div 
          onClick={() => setFilterType('manuscrito')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterType === 'manuscrito' 
              ? 'bg-[#FAF7F2] border-[#D4AF37] shadow-xs' 
              : 'bg-white border-[#E8DEC8] hover:border-[#D4AF37]'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[#6B5E55]">
            <span className="font-medium">Manuscritos Digitales</span>
            <Feather className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="font-editorial text-2xl font-bold text-[#2C241E] mt-1">
            {totalLetters}
          </div>
          <div className="text-[11px] text-[#8C7A6B]">
            Cartas selladas
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'todos', label: 'Todos los Archivos' },
            { id: 'audio', label: 'Audios de Micrófono' },
            { id: 'video', label: 'Testimonios en Video' },
            { id: 'manuscrito', label: 'Cartas Selladas' },
          ].map((tab) => {
            const isSelected = filterType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
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

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
          <input
            type="text"
            placeholder="Buscar por título o destinatario..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-white border border-[#E8DEC8] focus:border-[#D4AF37] outline-none text-[#2C241E] shadow-xs"
          />
        </div>
      </div>

      {/* LISTA DE ARCHIVOS MULTIMEDIA CON REPRODUCTORES INDIVIDUALES */}
      <div className="space-y-4">
        {mediaMemories.map((mem) => {
          const isAudio = mem.memoryType === 'voz' || Boolean(mem.hasVoiceNote || mem.audioUrl);
          const isVideo = mem.memoryType === 'video';

          return (
            <div
              key={mem.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE8DE] hover:border-[#D4AF37]/80 shadow-soft transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] flex items-center justify-center text-[#D4AF37]">
                    {isAudio ? <Volume2 className="w-4 h-4" /> : isVideo ? <Video className="w-4 h-4" /> : <Feather className="w-4 h-4" />}
                  </div>

                  <div>
                    <h3 
                      onClick={() => onOpenMemory(mem)}
                      className="font-editorial text-base sm:text-lg font-bold text-[#2C241E] hover:text-[#A88720] transition-colors cursor-pointer"
                    >
                      {mem.title}
                    </h3>
                    <div className="text-[11px] text-[#8C7A6B] flex items-center space-x-2">
                      <span>Destinatario: <strong className="text-[#2C241E]">{mem.recipient}</strong></span>
                      <span>·</span>
                      <span>{mem.dateCreated}</span>
                      <span>·</span>
                      <span>Duración: {mem.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <span className="text-[11px] text-[#8C6D1F] bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#D4AF37]/30 flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-[#D4AF37]" />
                    <span>{mem.status || 'Cifrado'}</span>
                  </span>

                  <button
                    onClick={() => onOpenMemory(mem)}
                    className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-[#FAF7F2] hover:bg-[#F3ECE2] border border-[#E8DEC8] text-xs font-semibold text-[#2C241E] transition-colors"
                  >
                    <span>Ver Recuerdo</span>
                    <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                  </button>
                </div>
              </div>

              {/* REPRODUCTOR DE AUDIO HTML5 DIRECTO SI EXISTE URL O ES NOTA DE VOZ */}
              {isAudio && (
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#6B5E55]">
                    <span className="font-semibold text-[#2C241E] flex items-center space-x-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Reproductor de Voz Auténtica</span>
                    </span>
                    <span className="font-mono text-[11px]">Storage: eternal-media</span>
                  </div>

                  {mem.audioUrl ? (
                    <audio 
                      controls 
                      src={mem.audioUrl} 
                      className="w-full h-10 outline-none" 
                      preload="metadata"
                    />
                  ) : (
                    <div className="flex items-center justify-between text-xs text-[#8C7A6B] p-2 bg-white rounded-lg border border-[#EFE8DE]">
                      <span>Registro de voz original resguardado ({mem.duration}).</span>
                      <button
                        onClick={() => onOpenMemory(mem)}
                        className="text-[#A88720] font-semibold underline hover:text-[#947113]"
                      >
                        Abrir y escuchar en lector
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Preview de Video si aplica */}
              {isVideo && mem.videoThumbnail && (
                <div className="relative rounded-xl overflow-hidden aspect-video max-h-48 bg-slate-900 border border-[#E8DEC8]">
                  <img src={mem.videoThumbnail} alt={mem.title} className="w-full h-full object-cover opacity-85" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={() => onOpenMemory(mem)}
                      className="w-12 h-12 rounded-full bg-[#D4AF37] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-soft"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Fragmento de Carta si aplica */}
              {!isAudio && !isVideo && (
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] text-xs font-editorial italic text-[#4A3E34] line-clamp-2">
                  "{mem.preview}"
                </div>
              )}
            </div>
          );
        })}

        {mediaMemories.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#EFE8DE] space-y-3">
            <Volume2 className="w-8 h-8 text-[#8C7A6B] mx-auto opacity-50" />
            <p className="text-sm font-editorial text-[#2C241E]">
              No se encontraron archivos en este filtro.
            </p>
            <button
              onClick={onOpenNewMemory}
              className="text-xs font-semibold text-[#A88720] underline"
            >
              Grabar nueva nota de voz ahora
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
