import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  Camera, 
  Video, 
  Feather, 
  Lock, 
  Glasses, 
  Info, 
  Square, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Smartphone,
  AlertCircle,
  RotateCcw,
  Loader2,
  Volume2,
  Activity
} from 'lucide-react';
import { Memory, FamilyMember } from '../types/eternal';

interface NewMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    memory: Memory, 
    audioBlob?: Blob, 
    audioMimeType?: string, 
    durationSeconds?: number
  ) => Promise<void> | void;
  familyMembers?: FamilyMember[];
}

interface AudioDiagnostics {
  tracksCount: number;
  trackEnabled: boolean;
  trackReadyState: string;
  trackMuted: boolean;
  mimeTypeUsed: string;
  blobSize: number;
  blobType: string;
}

/**
 * Detecta el formato óptimo soportado por el navegador (Safari iOS / iPhone / Chrome / etc.)
 * Se prioriza formato nativo real evitando tipos que produzcan contenedores vacíos o ruido.
 */
function getSupportedAudioMimeType(): string {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return '';
  }

  const isSafariOrIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome'));

  // En Safari / iOS audio/mp4 y audio/aac son los formatos con codificador de hardware nativo.
  // En Chrome y navegadores Chromium, audio/webm con opus es el estándar más robusto.
  const candidates = isSafariOrIOS
    ? [
        'audio/mp4',
        'audio/aac',
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/wav',
      ]
    : [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/wav',
      ];

  for (const candidate of candidates) {
    try {
      if (typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(candidate)) {
        return candidate;
      }
    } catch {
      // ignore and test next candidate
    }
  }

  return '';
}

export const NewMemoryModal: React.FC<NewMemoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  familyMembers = [],
}) => {
  // Mode: 'voz' | 'video_selfie' | 'video_pov' | 'carta'
  const [activeMode, setActiveMode] = useState<'voz' | 'video_selfie' | 'video_pov' | 'carta'>('voz');
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState(familyMembers[0]?.name || 'Sofía');
  const [recipientRelation, setRecipientRelation] = useState(familyMembers[0]?.relation || 'Hija');
  const [releaseCondition, setReleaseCondition] = useState('Al cumplir la mayoría de edad (18 años)');
  const [letterContent, setLetterContent] = useState('');
  const [showTooltipPOV, setShowTooltipPOV] = useState(false);

  // Estados de grabación con MediaRecorder real (sin AudioContext ni procesadores)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasRecordingFinished, setHasRecordingFinished] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  // Blob y URL del audio grabado
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [audioMimeType, setAudioMimeType] = useState<string>('');

  // Diagnóstico técnico de audio para aislar y verificar la captura
  const [diagnostics, setDiagnostics] = useState<AudioDiagnostics | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Estados de guardado y persistencia en Supabase
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Referencias para MediaStream, MediaRecorder y timers
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  // Detener todos los tracks y limpiar memoria sin fallbacks
  const stopAndCleanupMedia = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('[E-Ternal Audio] Excepción deteniendo MediaRecorder:', e);
      }
    }
    mediaRecorderRef.current = null;

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('[E-Ternal Audio] Excepción deteniendo track:', e);
        }
      });
      mediaStreamRef.current = null;
    }
  };

  // Limpieza al desmontar o cuando cambia la URL del blob
  useEffect(() => {
    return () => {
      stopAndCleanupMedia();
      if (audioBlobUrl) {
        URL.revokeObjectURL(audioBlobUrl);
      }
    };
  }, [audioBlobUrl]);

  // Manejo de cierre seguro
  const handleCloseModal = () => {
    if (isSubmitting) return;
    stopAndCleanupMedia();
    if (audioBlobUrl) {
      URL.revokeObjectURL(audioBlobUrl);
    }
    onClose();
  };

  // 1. INICIAR GRABACIÓN REAL CON EL MICRÓFONO (PIPELINE OBLIGATORIO)
  // Sin AudioContext, AnalyserNode, filtros ni visualizadores de ondas que interfieran con el hardware
  const handleStartRealRecording = async () => {
    setRecordingError(null);
    setSubmitError(null);

    // 1. Comprobar navigator.mediaDevices.getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setRecordingError(
        'El acceso al micrófono requiere una conexión segura (HTTPS) o no es compatible con este navegador.'
      );
      return;
    }

    try {
      // 2. Solicitar permiso exclusivamente con restricciones limpias
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // 3. Verificar explícitamente que se recibió un MediaStream
      if (!stream) {
        throw new Error('No se recibió MediaStream del dispositivo de audio.');
      }

      // 4. Verificar explícitamente que existe al menos un audio track
      const audioTracks = stream.getAudioTracks();
      if (!audioTracks || audioTracks.length === 0) {
        throw new Error('No se detectó ninguna pista de audio en el micrófono.');
      }

      const activeTrack = audioTracks[0];
      activeTrack.enabled = true;

      // 5. Detectar MIME compatible con el navegador
      const targetMime = getSupportedAudioMimeType();

      // Registro diagnóstico inicial
      const initialDiag: AudioDiagnostics = {
        tracksCount: audioTracks.length,
        trackEnabled: activeTrack.enabled,
        trackReadyState: activeTrack.readyState,
        trackMuted: activeTrack.muted,
        mimeTypeUsed: targetMime || 'Nativo del navegador',
        blobSize: 0,
        blobType: '',
      };
      setDiagnostics(initialDiag);
      console.info('[E-Ternal Audio Diagnostics - Inicio]', initialDiag);

      mediaStreamRef.current = stream;

      // 6. Crear MediaRecorder sin intermediarios de audio
      let recorder: MediaRecorder;
      try {
        recorder = targetMime 
          ? new MediaRecorder(stream, { mimeType: targetMime }) 
          : new MediaRecorder(stream);
      } catch (recErr) {
        console.warn('[E-Ternal Audio] Creación con mimeType falló, reintentando con MediaRecorder por defecto:', recErr);
        recorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const actualMime = recorder.mimeType || targetMime || 'audio/webm';
        const finalBlob = new Blob(audioChunksRef.current, { type: actualMime });

        // Comprobar que blob.size > 0
        if (finalBlob.size === 0) {
          setRecordingError('La grabación no contiene datos (0 bytes). Verifica los permisos del micrófono.');
          return;
        }

        setAudioBlob(finalBlob);
        setAudioMimeType(actualMime);

        // Crear Object URL local para <audio controls>
        const localUrl = URL.createObjectURL(finalBlob);
        setAudioBlobUrl(localUrl);

        // Actualizar diagnóstico final
        const finalDiag: AudioDiagnostics = {
          tracksCount: audioTracks.length,
          trackEnabled: activeTrack.enabled,
          trackReadyState: activeTrack.readyState,
          trackMuted: activeTrack.muted,
          mimeTypeUsed: actualMime,
          blobSize: finalBlob.size,
          blobType: finalBlob.type,
        };
        setDiagnostics(finalDiag);
        console.info('[E-Ternal Audio Diagnostics - Final]', finalDiag);

        // Liberar todos los audio tracks del micrófono inmediatamente
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => {
            try {
              track.stop();
            } catch {}
          });
          mediaStreamRef.current = null;
        }
      };

      // 7. Iniciar grabación real con recolección de chunks periódicos
      recorder.start(250);
      startTimeRef.current = Date.now();
      setIsRecording(true);
      setHasRecordingFinished(false);
      setRecordingSeconds(0);

      // Contador de tiempo real (límite de 60 segundos)
      timerIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setRecordingSeconds(elapsed);

        if (elapsed >= 60) {
          handleStopRealRecording();
        }
      }, 250);

    } catch (err: any) {
      console.error('[E-Ternal Audio] Error accediendo al micrófono:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setRecordingError(
          'Se necesita permiso para usar el micrófono. El acceso fue denegado. Revisa los permisos de Safari para E-Ternal en Ajustes > Safari > Micrófono.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setRecordingError('No se encontró ningún micrófono conectado en este dispositivo.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setRecordingError('El micrófono está siendo utilizado por otra aplicación o llamada.');
      } else if (err.name === 'SecurityError') {
        setRecordingError('Acceso al micrófono restringido por políticas de seguridad del navegador o falta de HTTPS.');
      } else {
        setRecordingError(`Error al inicializar micrófono: ${err.message || 'Error desconocido'}`);
      }
      setIsRecording(false);
    }
  };

  // 2. DETENER GRABACIÓN REAL
  const handleStopRealRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('[E-Ternal Audio] Error deteniendo MediaRecorder:', e);
      }
    }

    setIsRecording(false);
    setHasRecordingFinished(true);
  };

  // 3. VOLVER A GRABAR (Descarta audio local y reinicia estado)
  const handleResetRecording = () => {
    stopAndCleanupMedia();
    if (audioBlobUrl) {
      URL.revokeObjectURL(audioBlobUrl);
      setAudioBlobUrl(null);
    }
    setAudioBlob(null);
    setAudioMimeType('');
    setRecordingSeconds(0);
    setHasRecordingFinished(false);
    setIsRecording(false);
    setRecordingError(null);
    setSubmitError(null);
    setDiagnostics(null);
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
    const remaining = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min((recordingSeconds / 60) * 100, 100);
  const recordedDurationFormatted = formatSeconds(recordingSeconds || 0);

  // 4. GUARDAR Y SUBIR A SUPABASE (Sólo tras confirmar reproducción local)
  const handleSaveMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setSubmitError(null);

    // Validación estricta para modo voz: exige blob con contenido real
    if (activeMode === 'voz') {
      if (!audioBlob || audioBlob.size === 0) {
        setSubmitError('Por favor graba tu nota de voz y verifica que se escuche antes de guardar.');
        return;
      }
    }

    let finalType: 'voz' | 'video' | 'carta' = 'voz';
    if (activeMode === 'video_selfie' || activeMode === 'video_pov') finalType = 'video';
    if (activeMode === 'carta') finalType = 'carta';

    const durationFormatted = finalType === 'carta' 
      ? 'Lectura 2 min' 
      : recordedDurationFormatted;

    const contentToSave = activeMode === 'carta' && letterContent.trim()
      ? letterContent.trim()
      : `Testimonio custodiado en modo ${activeMode.replace('_', ' ').toUpperCase()} para ${recipient}. Resguardo de voz y memoria viva en E-ternal.`;

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
    };

    try {
      setIsSubmitting(true);

      // Delegar en el handler: auth.uid() -> people -> memories -> storage -> media_assets
      await onSave(
        newMem, 
        audioBlob || undefined, 
        audioMimeType || undefined, 
        recordingSeconds
      );

      setSubmitSuccess(true);
      setTimeout(() => {
        handleCloseModal();
      }, 1400);
    } catch (err: any) {
      console.error('[E-Ternal Audio] Error durante el guardado en Supabase:', err);
      // No silenciar el error de Supabase
      setSubmitError(err.message || 'Error al persistir el recuerdo y el audio en Supabase.');
      setIsSubmitting(false);
    }
  };

  // Validación de montaje condicional segura: DESPUÉS de todos los hooks
  if (!isOpen) return null;

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
              <p className="text-xs text-[#6B5E55] font-sans">Captura auténtica con resguardo privado</p>
            </div>
          </div>

          <button
            onClick={handleCloseModal}
            disabled={isSubmitting}
            className="p-1.5 rounded-xl text-[#8C7A6B] hover:text-[#2C241E] hover:bg-[#EFE8DE] transition-colors disabled:opacity-50"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSaveMemory} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TWO COLUMNS: LEFT (ACTIVA) & RIGHT (FUTURO) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            
            {/* COLUMNA IZQUIERDA ACTIVA */}
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
                  Selecciona el formato de captura con el micrófono real de tu dispositivo:
                </p>

                {/* 4 ACTION BUTTONS */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {/* 1. Nota de Voz */}
                  <button
                    type="button"
                    onClick={() => setActiveMode('voz')}
                    disabled={isRecording || isSubmitting}
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
                    disabled={isRecording || isSubmitting}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      activeMode === 'video_selfie'
                        ? 'border-[#D4AF37] bg-[#FAF7F2] text-[#2C241E] shadow-xs ring-1 ring-[#D4AF37]'
                        : 'border-[#E8DEC8] bg-white hover:bg-[#FAF7F2] text-[#6B5E55]'
                    }`}
                  >
                    <Camera className={`w-5 h-5 mb-1 ${activeMode === 'video_selfie' ? 'text-[#D4AF37]' : 'text-[#8C7A6B]'}`} />
                    <span className="text-xs font-semibold">Video Selfie</span>
                  </button>

                  {/* 3. Video POV con celular */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMode('video_pov');
                        setShowTooltipPOV(!showTooltipPOV);
                      }}
                      disabled={isRecording || isSubmitting}
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

                    {showTooltipPOV && (
                      <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-[#2C241E] text-white text-xs leading-relaxed shadow-soft border border-[#D4AF37]/60 text-left pointer-events-none">
                        <p className="font-sans text-slate-100">
                          Sostén el celular horizontal a la altura de tus ojos, con luz frontal natural.
                        </p>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2C241E]" />
                      </div>
                    )}
                  </div>

                  {/* 4. Escribir Carta */}
                  <button
                    type="button"
                    onClick={() => setActiveMode('carta')}
                    disabled={isRecording || isSubmitting}
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

            {/* COLUMNA DERECHA FUTURO */}
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

          {/* INPUT TÍTULO Y SELECTORES */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E55] mb-1.5">
                Título del recuerdo
              </label>
              <input
                type="text"
                required
                disabled={isSubmitting}
                placeholder="Ej. Palabras sobre la perseverancia para cuando dudes del camino..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DEC8] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm text-[#2C241E] font-editorial bg-white placeholder:font-sans placeholder:text-[#9E9187]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E55] mb-1.5">
                  Destinatario
                </label>
                <select
                  value={recipient}
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  value={releaseCondition}
                  onChange={(e) => setReleaseCondition(e.target.value)}
                  placeholder="Ej. En su 18º cumpleaños / Matrimonio"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] focus:border-[#D4AF37] outline-none text-xs sm:text-sm text-[#2C241E] bg-white"
                />
              </div>
            </div>

            {/* ÁREA DE GRABACIÓN REAL */}
            <div className="bg-[#FAF7F2] text-[#2C241E] p-5 rounded-2xl border border-[#D4AF37]/50 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-[#D4AF37]'}`} />
                  <span className="text-xs font-semibold text-[#A88720] uppercase tracking-wider">
                    {activeMode === 'carta' ? 'Área de Redacción Manuscrita' : 'Área de Grabación de Voz Real'}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono text-[#6B5E55]">
                  <span>{formatSeconds(recordingSeconds)}</span>
                  <span>/ 01:00</span>
                </div>
              </div>

              {/* Mensaje de error de permisos o hardware de micrófono */}
              {recordingError && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start space-x-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">Permiso o dispositivo requerido:</p>
                    <p className="leading-relaxed">{recordingError}</p>
                  </div>
                </div>
              )}

              {/* BARRA DE PROGRESO DORADA */}
              <div className="space-y-1">
                <div className="w-full h-2.5 rounded-full bg-[#EFE8DE] overflow-hidden relative border border-[#D4AF37]/30">
                  <div
                    className="h-full bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#F3E8C4] transition-all duration-300 shadow-gold-subtle"
                    style={{
                      width: activeMode === 'carta' 
                        ? `${Math.min((letterContent.length / 200) * 100, 100)}%` 
                        : `${progressPercent}%`
                    }}
                  />
                </div>
                
                {/* ESTADO VISUAL REQUERIDO (Antes / Durante / Después) */}
                <div className="flex justify-between text-[11px] text-[#6B5E55] pt-0.5">
                  <span className="font-medium">
                    {activeMode === 'carta' 
                      ? `${letterContent.length} caracteres escritos` 
                      : isRecording 
                        ? 'Grabando...' 
                        : hasRecordingFinished 
                          ? 'Grabación lista' 
                          : 'Pulsa Iniciar Grabación para comenzar'}
                  </span>
                  <span className="text-[#A88720] font-semibold">
                    {isRecording ? 'Micrófono en vivo' : 'Límite: 60s'}
                  </span>
                </div>
              </div>

              {/* Modo Carta o Modo Voz/Video */}
              {activeMode === 'carta' ? (
                <div>
                  <textarea
                    rows={4}
                    disabled={isSubmitting}
                    placeholder="Escribe aquí las palabras que resonarán en el corazón de quien ames..."
                    value={letterContent}
                    onChange={(e) => setLetterContent(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white border border-[#E8DEC8] text-[#2C241E] placeholder:text-[#9E9187] text-sm font-editorial leading-relaxed outline-none focus:border-[#D4AF37]"
                  />
                </div>
              ) : (
                <div className="space-y-4 pt-1">

                  {/* Indicador visual de estado de grabación limpio (Sin AudioContext ni analizador) */}
                  <div className="p-4 rounded-xl bg-white border border-[#E8DEC8] flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                        isRecording 
                          ? 'bg-rose-100 text-rose-600 animate-pulse' 
                          : hasRecordingFinished 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-[#FAF7F2] text-[#A88720]'
                      }`}>
                        {isRecording ? (
                          <Activity className="w-5 h-5 animate-pulse" />
                        ) : hasRecordingFinished ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Mic className="w-5 h-5" />
                        )}
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-[#2C241E]">
                          {isRecording ? (
                            <span className="text-rose-600">Captura de audio activa en el micrófono</span>
                          ) : hasRecordingFinished ? (
                            <span className="text-emerald-700">Audio capturado y disponible para prueba</span>
                          ) : (
                            <span>Micrófono listo para grabar</span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#8C7A6B]">
                          {isRecording 
                            ? 'Habla con naturalidad cerca de tu iPhone o equipo.' 
                            : hasRecordingFinished 
                              ? 'Escucha tu voz abajo antes de confirmar el guardado.' 
                              : 'Presiona "Iniciar Grabación" para comenzar.'}
                        </div>
                      </div>
                    </div>

                    <div className="font-mono text-xs font-semibold text-[#2C241E] bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#E8DEC8]">
                      {isRecording ? formatSeconds(recordingSeconds) : hasRecordingFinished ? recordedDurationFormatted : '00:00'}
                    </div>
                  </div>

                  {/* Controles de Grabación */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-[#6B5E55] flex items-center space-x-2">
                      <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Formato: <strong className="text-[#2C241E]">{audioMimeType || getSupportedAudioMimeType() || 'Nativo de Safari'}</strong></span>
                      {diagnostics && (
                        <button
                          type="button"
                          onClick={() => setShowDiagnostics(!showDiagnostics)}
                          className="text-[10px] text-[#A88720] underline ml-1 hover:text-[#947113]"
                        >
                          {showDiagnostics ? 'Ocultar diagnóstico' : 'Ver diagnóstico'}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {!isRecording && !hasRecordingFinished && (
                        <button
                          type="button"
                          onClick={handleStartRealRecording}
                          disabled={isSubmitting}
                          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-white font-semibold text-xs hover:bg-[#C59B27] transition-transform hover:scale-105 shadow-gold-subtle"
                        >
                          <Mic className="w-3.5 h-3.5" />
                          <span>Iniciar Grabación</span>
                        </button>
                      )}

                      {isRecording && (
                        <button
                          type="button"
                          onClick={handleStopRealRecording}
                          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold text-xs hover:bg-rose-500 transition-colors shadow-soft"
                        >
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>Detener Grabación</span>
                        </button>
                      )}

                      {hasRecordingFinished && !isRecording && (
                        <button
                          type="button"
                          onClick={handleResetRecording}
                          disabled={isSubmitting}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white text-[#2C241E] border border-[#E8DEC8] hover:border-[#D4AF37] text-xs font-semibold transition-colors shadow-xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Volver a grabar</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Diagnóstico técnico visible para verificación de tracks y codec */}
                  {showDiagnostics && diagnostics && (
                    <div className="p-3 bg-white rounded-xl border border-[#E8DEC8] text-[11px] text-[#4A3E34] space-y-1 font-mono">
                      <div>Pistas de audio: {diagnostics.tracksCount} (activa: {String(diagnostics.trackEnabled)}, mute: {String(diagnostics.trackMuted)})</div>
                      <div>Estado de pista: {diagnostics.trackReadyState}</div>
                      <div>MIME: {diagnostics.mimeTypeUsed}</div>
                      <div>Tamaño Blob: {diagnostics.blobSize} bytes ({(diagnostics.blobSize / 1024).toFixed(1)} KB)</div>
                      <div>Tipo Blob: {diagnostics.blobType}</div>
                    </div>
                  )}

                  {/* REPRODUCTOR HTML5 CON BLOB LOCAL PARA ESCUCHAR ANTES DE GUARDAR */}
                  {hasRecordingFinished && audioBlobUrl && (
                    <div className="p-4 rounded-xl bg-white border border-[#D4AF37]/70 shadow-xs space-y-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-editorial font-bold text-[#2C241E] flex items-center space-x-1.5">
                          <Volume2 className="w-4 h-4 text-[#D4AF37]" />
                          <span>Reproducción local antes de guardar:</span>
                        </span>
                        <span className="font-mono text-[11px] text-[#A88720]">
                          {recordedDurationFormatted} · {(audioBlob?.size ? (audioBlob.size / 1024).toFixed(1) + ' KB' : '')}
                        </span>
                      </div>
                      
                      {/* Control nativo HTML5 que garantiza reproducción en iPhone Safari y Chrome */}
                      <audio 
                        controls 
                        src={audioBlobUrl} 
                        className="w-full h-11 outline-none" 
                        preload="auto"
                      />

                      <div className="text-[11px] text-[#6B5E55] bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E8DEC8]">
                        🔊 <strong>Confirmación:</strong> Presiona Play arriba para escuchar tu voz. Si se escucha claro, haz clic en "Guardar y Cifrar en Bóveda". Si escuchas ruido, pulsa "Volver a grabar".
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

          </div>

          {/* MENSAJES DE ESTADO DE SUBIDA Y PERSISTENCIA */}
          {submitError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs flex items-start space-x-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Error de persistencia en Supabase:</p>
                <p className="leading-relaxed font-sans">{submitError}</p>
              </div>
            </div>
          )}

          {submitSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center space-x-2.5 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="font-bold">Recuerdo guardado correctamente</p>
            </div>
          )}

          {/* Action Buttons Footer */}
          <div className="pt-4 border-t border-[#EFE8DE] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-[#6B5E55] hover:text-[#2C241E] transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isRecording || isSubmitting || (activeMode === 'voz' && !audioBlob)}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#D4AF37] text-white hover:bg-[#C59B27] border border-[#D4AF37] shadow-gold-subtle transition-all text-xs font-semibold disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                  <span>Guardando en Supabase...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span>Guardar y Cifrar en Bóveda</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
