import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Lock, 
  Unlock, 
  Volume2, 
  VolumeX, 
  Share2, 
  Download, 
  Calendar, 
  User, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Feather 
} from 'lucide-react';
import { Memory } from '../types/eternal';

interface MemoryReaderModalProps {
  memory: Memory | null;
  onClose: () => void;
}

export const MemoryReaderModal: React.FC<MemoryReaderModalProps> = ({ memory, onClose }) => {
  const [isSealed, setIsSealed] = useState(true);
  const [isUnsealing, setIsUnsealing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (memory) {
      setIsSealed(memory.isLocked);
      setIsUnsealing(false);
      setIsPlayingAudio(false);
      setAudioProgress(0);
    }
  }, [memory]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAudio && !memory?.audioUrl) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 2;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio, memory?.audioUrl]);

  const togglePlayAudio = () => {
    if (isPlayingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlayingAudio(false);
    } else {
      if (memory?.audioUrl) {
        if (!audioRef.current) {
          const audio = new Audio(memory.audioUrl);
          audio.onended = () => {
            setIsPlayingAudio(false);
            setAudioProgress(0);
          };
          audio.ontimeupdate = () => {
            if (audio.duration) {
              setAudioProgress((audio.currentTime / audio.duration) * 100);
            }
          };
          audioRef.current = audio;
        }
        audioRef.current.play().catch((err) => console.warn('Audio playback error:', err));
      }
      setIsPlayingAudio(true);
    }
  };

  if (!memory) return null;

  const handleBreakSeal = () => {
    setIsUnsealing(true);
    setTimeout(() => {
      setIsSealed(false);
      setIsUnsealing(false);
    }, 900);
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(`"${memory.title}" - Legado de Enrique Morales para ${memory.recipient}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadTranscript = () => {
    const textBlob = new Blob([
      `E-TERNAL: GUARDIÁN DE LA MEMORIA\n` +
      `Título: ${memory.title}\n` +
      `Destinatario: ${memory.recipient} (${memory.recipientRelation})\n` +
      `Fecha de resguardo: ${memory.dateCreated}\n` +
      `Condición de liberación: ${memory.releaseCondition}\n` +
      `Nivel de Seguridad: ${memory.securityLevel}\n\n` +
      `-----------------------------------------\n\n` +
      `${memory.fullContent}\n\n` +
      `-----------------------------------------\n` +
      `Resguardado con protocolo criptográfico E-ternal.`
    ], { type: 'text/plain;charset=utf-8' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(textBlob);
    link.download = `Legado-${memory.recipient.replace(/\s+/g, '_')}-${memory.id}.txt`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#2C241E]/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#FFFFFF] w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-soft-lg border border-[#D4AF37]/40 flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Top Gold Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#D4AF37]/30 via-[#D4AF37] to-[#D4AF37]/30" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EFE8DE] bg-[#FAF7F2]">
          <div className="flex items-center space-x-2 text-xs text-[#6B5E55]">
            <span className="font-semibold text-[#2C241E] uppercase tracking-wider">Bóveda Cifrada</span>
            <span>·</span>
            <span>Ref. {memory.id}</span>
            <span>·</span>
            <span className="flex items-center space-x-1 text-[#A88720] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{memory.securityLevel}</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8C7A6B] hover:text-[#2C241E] hover:bg-[#EFE8DE] transition-colors"
            title="Cerrar lectura"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6">

          {/* SEALED STATE OVERLAY */}
          {isSealed ? (
            <div className="py-12 px-4 text-center max-w-md mx-auto space-y-6">
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                {/* Golden Wax Seal Emblem */}
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#C59B27] to-[#997316] p-1 shadow-gold-subtle flex items-center justify-center transition-transform duration-700 ${isUnsealing ? 'scale-125 rotate-45 opacity-0' : 'hover:scale-105'}`}>
                  <div className="w-full h-full rounded-full border-2 border-white/50 flex flex-col items-center justify-center text-white">
                    <Feather className="w-8 h-8 text-white drop-shadow-sm" />
                    <span className="text-[10px] tracking-widest uppercase font-semibold text-white mt-0.5">Sello</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-editorial text-2xl font-bold text-[#2C241E]">
                  Memoria Bajo Custodia Sagrada
                </h3>
                <p className="text-sm text-[#6B5E55] leading-relaxed font-sans">
                  Esta cápsula está asignada exclusivamente a <strong className="text-[#2C241E]">{memory.recipient}</strong> ({memory.recipientRelation}).
                </p>
                <div className="inline-flex items-center space-x-2 text-xs text-[#8C6D1F] bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#D4AF37]/40 mt-2 shadow-xs">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Condición: {memory.releaseCondition}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleBreakSeal}
                  disabled={isUnsealing}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#D4AF37] text-white hover:bg-[#C59B27] border border-[#D4AF37] shadow-gold-subtle transition-all duration-300 font-semibold text-sm group"
                >
                  <Unlock className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                  <span>{isUnsealing ? 'Ruptura solemne en curso...' : 'Apertura Ceremonial de Prueba'}</span>
                </button>
                <p className="text-[11px] text-[#8C7A6B] mt-2">
                  En calidad de autor puedes previsualizar el testimonio antes de su entrega definitiva.
                </p>
              </div>
            </div>
          ) : (
            /* UNSEALED / READING EXPERIENCE */
            <div className="space-y-8 animate-fadeIn">
              
              {/* Top metadata banner */}
              <div className="pb-6 border-b border-[#EFE8DE]">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#6B5E55] mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-semibold text-[#2C241E]">Destinatario:</span>
                    <span className="text-[#4A3E34]">{memory.recipient} ({memory.recipientRelation})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[#8C7A6B]" />
                    <span>Resguardo original: {memory.dateCreated}</span>
                  </div>
                </div>

                <h1 className="font-editorial text-3xl sm:text-4xl text-[#2C241E] font-bold leading-tight">
                  {memory.title}
                </h1>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {memory.tags.map((tag) => (
                    <span key={tag} className="text-xs text-[#6B5E55] bg-[#FAF7F2] px-2.5 py-1 rounded-xl border border-[#E8DEC8]">
                      #{tag}
                    </span>
                  ))}
                  {memory.releaseDate && (
                    <span className="text-xs text-[#8C6D1F] bg-[#FAF7F2] px-2.5 py-1 rounded-xl border border-[#D4AF37]/40 flex items-center space-x-1">
                      <ClockIcon className="w-3 h-3 text-[#D4AF37]" />
                      <span>Previsto: {memory.releaseDate}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Audio Voice Player if applicable */}
              {memory.hasVoiceNote && (
                <div className="bg-[#FAF7F2] text-[#2C241E] p-5 rounded-2xl shadow-soft space-y-3 border border-[#D4AF37]/50">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-[#A88720]">
                      <Volume2 className="w-4 h-4 text-[#D4AF37]" />
                      <span className="font-semibold tracking-wide uppercase">Registro de Voz Auténtica</span>
                    </div>
                    <span className="text-[#6B5E55] font-mono">{memory.audioDuration || '04:18'}</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={togglePlayAudio}
                      className="w-11 h-11 rounded-full bg-[#D4AF37] text-white flex items-center justify-center hover:bg-[#C59B27] transition-transform hover:scale-105 shadow-gold-subtle"
                      title={isPlayingAudio ? 'Pausar audio' : 'Reproducir voz'}
                    >
                      {isPlayingAudio ? (
                        <div className="flex space-x-1">
                          <span className="w-1 h-3.5 bg-white rounded-full" />
                          <span className="w-1 h-3.5 bg-white rounded-full" />
                        </div>
                      ) : (
                        <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-white ml-1" />
                      )}
                    </button>

                    {/* Simulated Waveform */}
                    <div className="flex-1 flex items-center space-x-1 h-8">
                      {[14, 28, 45, 70, 85, 40, 60, 95, 80, 50, 65, 30, 85, 90, 75, 45, 60, 35, 70, 80, 40, 25, 55, 65, 90, 40, 30, 20].map((h, i) => {
                        const active = (i / 28) * 100 <= audioProgress;
                        return (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-all duration-150 ${
                              active ? 'bg-[#D4AF37]' : 'bg-[#D8C9B4]'
                            }`}
                            style={{ height: `${h}%` }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] text-[#8C7A6B]">
                    <span>Voz masterizada sin alteraciones</span>
                    <span>Tono: Serena, Paternal</span>
                  </div>
                </div>
              )}

              {/* Letter / Editorial Content */}
              <div className="relative py-4">
                <div className="font-editorial text-lg sm:text-xl text-[#2C241E] leading-relaxed sm:leading-loose whitespace-pre-line tracking-wide selection:bg-[#D4AF37]/25 p-5 bg-[#FAF7F2]/60 rounded-2xl border border-[#E8DEC8]">
                  {memory.fullContent}
                </div>

                {/* Wax seal signet mark at bottom */}
                <div className="pt-10 flex items-center justify-between border-t border-[#EFE8DE] mt-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full border border-[#D4AF37] bg-white flex items-center justify-center font-editorial text-sm font-bold text-[#A88720] shadow-xs">
                      EM
                    </div>
                    <div>
                      <div className="font-editorial text-sm font-semibold text-[#2C241E]">Enrique Morales</div>
                      <div className="text-xs text-[#8C7A6B]">Firmado con resguardo E-ternal</div>
                    </div>
                  </div>

                  <div className="text-right text-xs text-[#8C7A6B]">
                    <div>Sellado el {memory.dateCreated}</div>
                    <div className="text-[#A88720] font-semibold">Bóveda Inalterable</div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        {!isSealed && (
          <div className="px-6 py-4 bg-[#FAF7F2] border-t border-[#EFE8DE] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyCitation}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-[#2C241E] hover:text-[#A88720] bg-white rounded-xl border border-[#E8DEC8] hover:border-[#D4AF37] transition-colors shadow-xs"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
                <span>{copiedLink ? 'Cita copiada' : 'Copiar cita'}</span>
              </button>

              <button
                onClick={handleDownloadTranscript}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-[#2C241E] hover:text-[#A88720] bg-white rounded-xl border border-[#E8DEC8] hover:border-[#D4AF37] transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Exportar Manuscrito</span>
              </button>
            </div>

            <button
              onClick={() => setIsSealed(true)}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-[#6B5E55] hover:text-[#2C241E] bg-[#EFE8DE] hover:bg-[#EAE0D2] rounded-xl transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-[#8C7A6B]" />
              <span>Volver a precintar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
