import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mic, 
  Camera, 
  Video, 
  Feather, 
  Lock, 
  Glasses, 
  Info, 
  Play, 
  Square, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Smartphone,
  ChevronDown
} from 'lucide-react';
import { Memory, FamilyMember } from '../types/eternal';

interface NewMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memory: Memory) => void;
  familyMembers?: FamilyMember[];
}

export const NewMemoryModal: React.FC<NewMemoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  familyMembers = [],
}) => {
  if (!isOpen) return null;

  // Mode: 'voz' | 'video_selfie' | 'video_pov' | 'carta'
  const [activeMode, setActiveMode] = useState<'voz' | 'video_selfie' | 'video_pov' | 'carta'>('voz');
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState(familyMembers[0]?.name || 'Sofía');
  const [recipientRelation, setRecipientRelation] = useState(familyMembers[0]?.relation || 'Hija');
  const [releaseCondition, setReleaseCondition] = useState('Al cumplir la mayoría de edad (18 años)');
  const [letterContent, setLetterContent] = useState('');
  const [showTooltipPOV, setShowTooltipPOV] = useState(false);

  // Recording simulation state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasRecordingFinished, setHasRecordingFinished] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 60) {
            setIsRecording(false);
            setHasRecordingFinished(true);
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    setRecordingSeconds(0);
    setHasRecordingFinished(false);
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasRecordingFinished(true);
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setRecipient(name);
    const member = familyMembers.find((m) => m.name === name);
    if (member) {
      setRecipientRelation(member.relation);
    } else {
      if (name.includes('Mamá')) setRecipientRelation('Esposa');
      else if (name.includes('Carlos')) setRecipientRelation('Hijo');
      else if (name.includes('Lucía')) setRecipientRelation('Hija');
      else setRecipientRelation('Familiar');
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min((recordingSeconds / 60) * 100, 100);
  const recordedDuration = formatSeconds(recordingSeconds || 24);

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let finalType: 'voz' | 'video' | 'carta' = 'voz';
    if (activeMode === 'video_selfie' || activeMode === 'video_pov') finalType = 'video';
    if (activeMode === 'carta') finalType = 'carta';

    const durationFormatted = finalType === 'carta' 
      ? 'Lectura 2 min' 
      : hasRecordingFinished 
        ? formatSeconds(recordingSeconds) 
        : '01:14';

    const contentToSave = activeMode === 'carta' && letterContent.trim()
      ? letterContent.trim()
      : `Testimonio custodiado en modo ${activeMode.replace('_', ' ').toUpperCase()} para ${recipient}. Sinceridad, principios morales y recuerdo vivo preservado en la Bóveda E-ternal.`;

    const videoThumbnailUrl = finalType === 'video'
      ? (activeMode === 'video_pov'
          ? 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800'
          : 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800')
      : undefined;

    const newMem: Memory = {
      id: `mem-${Date.now()}`,
      title: title.trim(),
      recipient,
      recipientRelation,
      category: finalType === 'carta' ? 'cartas' : finalType === 'video' ? 'video' : 'audio',
      memoryType: finalType,
      dateCreated: new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date()),
      releaseCondition,
      preview: contentToSave.slice(0, 150) + '...',
      fullContent: contentToSave,
      duration: durationFormatted,
      status: 'Cifrado',
      compatibility: { mobile: true, glasses: true },
      tags: ['Recuerdo', recipient, finalType.toUpperCase()],
      isLocked: true,
      securityLevel: 'Alta Custodia',
      hasVoiceNote: finalType === 'voz',
      audioDuration: finalType === 'voz' ? durationFormatted : undefined,
      videoDuration: finalType === 'video' ? durationFormatted : undefined,
      videoThumbnail: videoThumbnailUrl,
    };

    onSave(newMem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#2C241E]/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FFFFFF] w-full max-w-3xl max-h-[92vh] rounded-2xl shadow-soft-lg border border-[#D4AF37]/50 flex flex-col overflow-hidden">
        {/* Top Gold Hairline */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#D4AF37]/30 via-[#D4AF37] to-[#D4AF37]/30" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EFE8DE] bg-[#FAF7F2]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37] shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold text-[#2C241E]">Nuevo Recuerdo</h2>
              <p className="text-xs text-[#6B5E55] font-sans">Captura y resguardo en Bóveda Eterna</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8C7A6B] hover:text-[#2C241E] hover:bg-[#EFE8DE] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSaveMemory} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TWO COLUMNS REQUIRED: LEFT (ACTIVA) & RIGHT (FUTURO) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            
            {/* COLUMNA IZQUIERDA ACTIVA - BORDE SÓLIDO */}
            <div className="bg-white rounded-2xl p-5 border-2 border-solid border-[#D4AF37] shadow-soft flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-[#D4AF37]" />
                    <h3 className="font-editorial text-base font-bold text-[#2C241E]">
                      Grabar con Celular - HOY
                    </h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#A88720] border border-[#D4AF37]/40 shadow-xs">
                    Activo
                  </span>
                </div>
                <p className="text-xs text-[#6B5E55] font-sans">
                  Selecciona el formato de captura inmediata con la cámara y micrófono de tu dispositivo actual:
                </p>

                {/* 4 ACTION BUTTONS */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {/* 1. Nota de Voz */}
                  <button
                    type="button"
                    onClick={() => setActiveMode('voz')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      activeMode === 'voz'
                        ? 'border-[#D4AF37] bg-[#FAF7F2] text-[#2C241E] shadow-xs ring-1 ring-[#D4AF37]'
                        : 'border-[#E8DEC8] bg-white hover:bg-[#FAF7F2] text-[#6B5E55]'
                    }`}
                  >
                    <Mic className={`w-5 h-5 mb-1 ${activeMode === 'voz' ? 'text-[#D4AF37]' : 'text-[#8C7A6B]'}`} />
                    <span className="text-xs font-semibold">Nota de Voz</span>
                  </button>

                  {/* 2. Video Selfie */}
                  <button
                    type="button"
                    onClick={() => setActiveMode('video_selfie')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      activeMode === 'video_selfie'
                        ? 'border-[#D4AF37] bg-[#FAF7F2] text-[#2C241E] shadow-xs ring-1 ring-[#D4AF37]'
                        : 'border-[#E8DEC8] bg-white hover:bg-[#FAF7F2] text-[#6B5E55]'
                    }`}
                  >
                    <Camera className={`w-5 h-5 mb-1 ${activeMode === 'video_selfie' ? 'text-[#D4AF37]' : 'text-[#8C7A6B]'}`} />
                    <span className="text-xs font-semibold">Video Selfie</span>
                  </button>

                  {/* 3. Video POV con celular (con tooltip requerido) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMode('video_pov');
                        setShowTooltipPOV(!showTooltipPOV);
                      }}
                      onMouseEnter={() => setShowTooltipPOV(true)}
                      onMouseLeave={() => setShowTooltipPOV(false)}
                      className={`w-full h-full flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all relative ${
                        activeMode === 'video_pov'
                          ? 'border-[#D4AF37] bg-[#FAF7F2] text-[#2C241E] shadow-xs ring-1 ring-[#D4AF37]'
                          : 'border-[#E8DEC8] bg-white hover:bg-[#FAF7F2] text-[#6B5E55]'
                      }`}
                    >
                      <div className="flex items-center space-x-1 mb-1">
                        <Video className={`w-5 h-5 ${activeMode === 'video_pov' ? 'text-[#D4AF37]' : 'text-[#8C7A6B]'}`} />
                        <Info className="w-3.5 h-3.5 text-[#D4AF37]" />
                      </div>
                      <span className="text-xs font-semibold leading-tight">Video POV con celular</span>
                    </button>

                    {/* Tooltip obligatorio */}
                    {showTooltipPOV && (
                      <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-[#2C241E] text-white text-xs leading-relaxed shadow-soft border border-[#D4AF37]/60 text-left pointer-events-none">
                        <p className="font-sans text-slate-100">
                          Sostén el celular horizontal a la altura de tus ojos, buena luz. Formato compatible con gafas mañana.
                        </p>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2C241E]" />
                      </div>
                    )}
                  </div>

                  {/* 4. Escribir Carta */}
                  <button
                    type="button"
                    onClick={() => setActiveMode('carta')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      activeMode === 'carta'
                        ? 'border-[#D4AF37] bg-[#FAF7F2] text-[#2C241E] shadow-xs ring-1 ring-[#D4AF37]'
                        : 'border-[#E8DEC8] bg-white hover:bg-[#FAF7F2] text-[#6B5E55]'
                    }`}
                  >
                    <Feather className={`w-5 h-5 mb-1 ${activeMode === 'carta' ? 'text-[#D4AF37]' : 'text-[#8C7A6B]'}`} />
                    <span className="text-xs font-semibold">Escribir Carta</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-[#6B5E55] flex items-center space-x-1.5 pt-2 border-t border-[#EFE8DE]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Modo seleccionado: <strong className="text-[#2C241E] capitalize">{activeMode.replace('_', ' ')}</strong></span>
              </div>
            </div>

            {/* COLUMNA DERECHA FUTURO - BORDE DASHED OPACIDAD 0.7 */}
            <div className="bg-[#FAF7F2]/80 rounded-2xl p-5 border-2 border-dashed border-[#D4AF37]/60 opacity-75 flex flex-col justify-between space-y-4 relative">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Glasses className="w-5 h-5 text-[#8C7A6B]" />
                    <h3 className="font-editorial text-base font-bold text-[#2C241E]">
                      Ray-Ban Meta Glasses - FUTURO
                    </h3>
                  </div>
                  <Lock className="w-4 h-4 text-[#8C7A6B]" />
                </div>

                <p className="text-xs text-[#6B5E55] font-sans leading-relaxed">
                  Cuando tengas tus gafas, se sincroniza automático desde Meta View. Tus recuerdos de celular ya se verán en las gafas.
                </p>

                <div className="p-3 bg-white rounded-xl border border-[#E8DEC8] text-[11px] text-[#6B5E55] space-y-1">
                  <div className="flex items-center space-x-1.5 font-medium text-[#2C241E]">
                    <Glasses className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Visión Espacial Holográfica 👓</span>
                  </div>
                  <div>Preparado para visualización inmersiva en la próxima generación.</div>
                </div>
              </div>

              {/* Boton disabled "Sincronizar desde Meta View" */}
              <button
                type="button"
                disabled
                className="w-full py-2.5 px-4 rounded-xl bg-[#EFE8DE] text-[#8C7A6B] text-xs font-semibold cursor-not-allowed border border-[#E8DEC8] flex items-center justify-center space-x-2"
              >
                <Lock className="w-3.5 h-3.5 text-[#8C7A6B]" />
                <span>Sincronizar desde Meta View</span>
              </button>
            </div>

          </div>

          {/* ABAJO: INPUT TÍTULO DEL RECUERDO Y ÁREA DE GRABACIÓN */}
          <div className="space-y-4 pt-2">
            
            {/* Input Titulo */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E55] mb-1.5">
                Título del recuerdo
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Para cuando dudes de tu vocación / Recuerdos del verano en la finca..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DEC8] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm text-[#2C241E] font-editorial bg-white placeholder:font-sans placeholder:text-[#9E9187]"
              />
            </div>

            {/* Destinatario & Condición Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E55] mb-1.5">
                  Destinatario
                </label>
                <select
                  value={recipient}
                  onChange={handleRecipientChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] focus:border-[#D4AF37] outline-none text-xs sm:text-sm text-[#2C241E] bg-white"
                >
                  <option value="Sofía">Sofía (Hija menor)</option>
                  <option value="Mamá">Mamá (Elena - Esposa)</option>
                  <option value="Carlos">Carlos (Hijo mayor)</option>
                  <option value="Lucía">Lucía (Hija)</option>
                  <option value="Toda la familia">Toda la familia</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E55] mb-1.5">
                  Fecha o Condición de Apertura
                </label>
                <input
                  type="text"
                  value={releaseCondition}
                  onChange={(e) => setReleaseCondition(e.target.value)}
                  placeholder="Ej. En su 25º aniversario de vida / Boda"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] focus:border-[#D4AF37] outline-none text-xs sm:text-sm text-[#2C241E] bg-white"
                />
              </div>
            </div>

            {/* ÁREA DE GRABACIÓN CON BARRA DE PROGRESO DORADA */}
            <div className="bg-[#FAF7F2] text-[#2C241E] p-5 rounded-2xl border border-[#D4AF37]/50 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-[#D4AF37]'}`} />
                  <span className="text-xs font-semibold text-[#A88720] uppercase tracking-wider">
                    {activeMode === 'carta' ? 'Área de Redacción Manuscrita' : 'Área de Grabación Inmediata'}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono text-[#6B5E55]">
                  <span>{isRecording ? recordedDuration : hasRecordingFinished ? recordedDuration : '00:00'}</span>
                  <span>/ 01:00</span>
                </div>
              </div>

              {/* BARRA DE PROGRESO DORADA */}
              <div className="space-y-1">
                <div className="w-full h-2.5 rounded-full bg-[#EFE8DE] overflow-hidden relative border border-[#D4AF37]/30">
                  <div
                    className="h-full bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#F3E8C4] transition-all duration-300 shadow-gold-subtle"
                    style={{
                      width: activeMode === 'carta' ? `${Math.min((letterContent.length / 200) * 100, 100)}%` : `${progressPercent}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#6B5E55]">
                  <span>{activeMode === 'carta' ? `${letterContent.length} caracteres escritos` : isRecording ? 'Grabando señal de audio/video...' : hasRecordingFinished ? 'Grabación lista para sellar' : 'Pulsa Grabar para comenzar'}</span>
                  <span className="text-[#A88720] font-semibold">Barra Dorada E-ternal</span>
                </div>
              </div>

              {/* Mode-specific Recording Controls or Letter Textarea */}
              {activeMode === 'carta' ? (
                <div>
                  <textarea
                    rows={4}
                    placeholder="Escribe aquí las palabras que resonarán en el corazón de quien ames..."
                    value={letterContent}
                    onChange={(e) => setLetterContent(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white border border-[#E8DEC8] text-[#2C241E] placeholder:text-[#9E9187] text-sm font-editorial leading-relaxed outline-none focus:border-[#D4AF37]"
                  />
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                  {/* Waveform / Visualizer simulation */}
                  <div className="flex items-center space-x-1 h-9 flex-1 w-full sm:w-auto">
                    {[16, 32, 48, 80, 95, 60, 40, 75, 90, 85, 50, 30, 65, 80, 100, 70, 45, 35, 60, 85, 75, 50, 30, 20].map((h, i) => {
                      const active = isRecording ? (i % 3 === recordingSeconds % 3 || i % 2 === 0) : hasRecordingFinished;
                      return (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-200 ${
                            active ? 'bg-[#D4AF37]' : 'bg-[#D8C9B4]'
                          }`}
                          style={{ height: `${active ? h : 15}%` }}
                        />
                      );
                    })}
                  </div>

                  {/* Record / Stop Action Button */}
                  <div className="flex items-center space-x-2">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={handleStartRecording}
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-white font-semibold text-xs hover:bg-[#C59B27] transition-transform hover:scale-105 shadow-gold-subtle"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{hasRecordingFinished ? 'Regrabar' : 'Iniciar Grabación'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStopRecording}
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold text-xs hover:bg-rose-500 transition-colors animate-pulse"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Detener Grabación</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Action Buttons Footer */}
          <div className="pt-4 border-t border-[#EFE8DE] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#6B5E55] hover:text-[#2C241E] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isRecording}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#D4AF37] text-white hover:bg-[#C59B27] border border-[#D4AF37] shadow-gold-subtle transition-all text-xs font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>Guardar y Cifrar en Bóveda</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
