import React, { useState } from 'react';
import { 
  Smartphone, 
  Glasses, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Pause, 
  Volume2, 
  ShieldCheck, 
  Eye, 
  Radio, 
  Zap, 
  User, 
  CheckCircle2, 
  RotateCcw,
  Sliders
} from 'lucide-react';
import { Memory } from '../types/eternal';

interface ModoFuturoTabProps {
  memories?: Memory[];
  onOpenMemory?: (mem: Memory) => void;
}

export const ModoFuturoTab: React.FC<ModoFuturoTabProps> = () => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showOrionHologram, setShowOrionHologram] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(14);

  return (
    <div className="space-y-10 py-2">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#EFE8DE]">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#A88720]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>Trascendencia Tecnológica & Continuidad Espacial</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C241E] tracking-tight">
            Modo Futuro
          </h1>
          <p className="text-[#6B5E55] text-sm font-sans leading-relaxed pt-1">
            Lo que grabas hoy con tu celular se adapta naturalmente a la tecnología que usará tu familia mañana. Sin necesidad de regrabar nada.
          </p>
        </div>

        {/* TOGGLE DEMO "VISTA HOLOGRAMA ORION" */}
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowOrionHologram(!showOrionHologram)}
            className={`inline-flex items-center space-x-3 px-5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all duration-300 shadow-soft ${
              showOrionHologram
                ? 'bg-[#FAF7F2] text-[#2C241E] border-[#D4AF37] ring-1 ring-[#D4AF37]/50'
                : 'bg-white text-[#6B5E55] hover:text-[#2C241E] border-[#E8DEC8]'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${showOrionHologram ? 'text-[#D4AF37] animate-pulse' : 'text-[#8C7A6B]'}`} />
            <span>Vista Holograma Orion</span>
            
            {/* Toggle Switch */}
            <div 
              className={`w-8 h-4.5 rounded-full p-0.5 transition-colors flex items-center ${
                showOrionHologram ? 'bg-[#D4AF37] justify-end' : 'bg-[#E8DEC8] justify-start'
              }`}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
            </div>
          </button>
        </div>
      </div>

      {/* DIAGRAMA 3 PASOS: HOY -> MAÑANA -> FUTURO ORION (OBLIGATORIO) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EFE8DE] shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4">
          
          {/* PASO 1: HOY (Icono Celular) */}
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-white text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/50 shadow-xs">
              <Smartphone className="w-7 h-7" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#A88720]">Paso 1</span>
              <h3 className="font-editorial text-lg font-bold text-[#2C241E]">HOY</h3>
              <p className="text-xs text-[#6B5E55] font-sans">Celular habitual</p>
            </div>
          </div>

          {/* FLECHA 1 */}
          <div className="hidden md:flex justify-center items-center">
            <div className="flex items-center space-x-1 text-[#D4AF37]">
              <div className="w-8 h-[2px] bg-[#D4AF37]" />
              <ArrowRight className="w-5 h-5 text-[#D4AF37]" />
            </div>
          </div>

          {/* PASO 2: MAÑANA (Icono Gafas Ray-Ban) */}
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-white text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/50 shadow-xs">
              <Glasses className="w-7 h-7" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#A88720]">Paso 2</span>
              <h3 className="font-editorial text-lg font-bold text-[#2C241E]">MANANA</h3>
              <p className="text-xs text-[#6B5E55] font-sans">Gafas Ray-Ban Meta</p>
            </div>
          </div>

          {/* FLECHA 2 */}
          <div className="hidden md:flex justify-center items-center">
            <div className="flex items-center space-x-1 text-[#D4AF37]">
              <div className="w-8 h-[2px] bg-[#D4AF37]" />
              <ArrowRight className="w-5 h-5 text-[#D4AF37]" />
            </div>
          </div>

          {/* PASO 3: FUTURO ORION (Holograma) */}
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#FAF7F2] text-[#2C241E] border border-[#D4AF37] shadow-gold-subtle space-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#D4AF37]/5 pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37] text-white flex items-center justify-center border border-[#D4AF37] shadow-gold-subtle">
              <Sparkles className="w-7 h-7 animate-pulse text-white" />
            </div>
            <div className="space-y-0.5 relative z-10">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#A88720]">Paso 3</span>
              <h3 className="font-editorial text-lg font-bold text-[#2C241E]">FUTURO ORION</h3>
              <p className="text-xs text-[#6B5E55] font-sans">Holograma Interactivo</p>
            </div>
          </div>

        </div>
      </div>

      {/* 2 COLUMNAS: IZQUIERDA MOCKUP OSCURO DE GAFAS | DERECHA TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA: MOCKUP OSCURO DE GAFAS CON REPRODUCTOR */}
        <div className="lg:col-span-6 bg-[#1F1A17] text-white rounded-2xl p-6 sm:p-7 border border-[#D4AF37]/50 shadow-soft-lg space-y-5 relative overflow-hidden">
          
          {/* Subtle Ambient Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Gafas HUD Top Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
            <div className="flex items-center space-x-2 text-[#D4AF37]">
              <Glasses className="w-4 h-4" />
              <span className="font-mono tracking-wider uppercase text-[11px]">Meta Ray-Ban HUD · Visor 1080p</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sincronizado vía Meta View</span>
            </div>
          </div>

          {/* SIMULADOR DE LENTES DE GAFAS (Visor POV) */}
          <div className="relative rounded-2xl border-2 border-white/15 bg-gradient-to-b from-black/80 via-[#181412] to-black/90 p-5 sm:p-6 overflow-hidden space-y-5 shadow-inner">
            
            {/* Esquinas HUD de las gafas */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]" />

            {/* Video POV background simulator */}
            <div className="relative z-10 space-y-4">
              
              {/* ETIQUETA OBLIGATORIA */}
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-black/70 border border-[#D4AF37]/80 text-[11px] font-semibold text-[#D4AF37] shadow-xs">
                <Radio className="w-3.5 h-3.5 animate-pulse text-[#D4AF37]" />
                <span>Voz real de Ricardo - Video POV celular 2026 compatible</span>
              </div>

              {/* TEXTO / QUOTE DEL REPRODUCTOR (OBLIGATORIO) */}
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 backdrop-blur-xs space-y-2">
                <p className="font-editorial text-lg sm:text-xl text-slate-100 italic leading-relaxed">
                  "Hola mi Sofi, si estas viendo esto es tu graduacion..."
                </p>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  "...y no imaginas lo orgulloso que estoy de ti. Quise que vieras esta escena tal como yo la contemplaba, a la altura de mis ojos, con el mismo amor de siempre."
                </p>
              </div>

              {/* CONTROLES DEL REPRODUCTOR CON WAVEFORM */}
              <div className="bg-black/70 p-4 rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#D4AF37] font-mono font-medium">00:{playbackSeconds}</span>
                  <span className="text-slate-300 font-mono">03:45</span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-10 h-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center hover:bg-[#e0bc46] transition-transform hover:scale-105 shadow-gold-subtle flex-shrink-0"
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  {/* Onda sonora interactiva */}
                  <div className="flex-1 flex items-center space-x-1 h-8">
                    {[18, 35, 60, 85, 95, 70, 45, 30, 75, 90, 85, 45, 65, 80, 100, 75, 50, 35, 60, 85, 70, 50, 30, 20].map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-200 ${
                          isPlayingAudio ? 'bg-[#D4AF37]' : 'bg-slate-600'
                        }`}
                        style={{ height: `${isPlayingAudio ? h : Math.max(16, h * 0.55)}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                  <span>Audio Espacial Binaural</span>
                  <span className="text-[#D4AF37]">Ángulo Horizontal Natural</span>
                </div>
              </div>

            </div>

          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Resolución nativa: 1920x1080 horizontal</span>
            <span className="text-emerald-400 font-medium">100% Sin distorsión</span>
          </div>

        </div>

        {/* COLUMNA DERECHA: TIMELINE DE 3 ETAPAS */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-[#EFE8DE] shadow-soft space-y-6">
          
          <div className="space-y-1">
            <h2 className="font-editorial text-2xl font-bold text-[#2C241E]">
              Evolución del Recuerdo
            </h2>
            <p className="text-xs text-[#6B5E55] font-sans">
              La tecnología avanza, pero tu palabra permanece fiel a como la sentiste.
            </p>
          </div>

          {/* TIMELINE VERTICAL 3 ETAPAS */}
          <div className="space-y-6 relative pl-6 border-l-2 border-[#D4AF37]/50 ml-3">
            
            {/* 1. HOY: graba con celular horizontal */}
            <div className="relative space-y-1.5 group">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#D4AF37]" />
              <div className="flex items-center space-x-2">
                <span className="font-editorial text-lg font-bold text-[#2C241E]">HOY</span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">Presente</span>
              </div>
              <p className="text-sm font-semibold text-[#2C241E] font-sans">
                Graba con celular horizontal
              </p>
              <p className="text-xs text-[#6B5E55] leading-relaxed font-sans">
                Sostén tu celular horizontal a la altura de tus ojos con buena luz. Este encuadre coincide exactamente con el campo de visión del ojo humano y la cámara de las gafas de mañana.
              </p>
            </div>

            {/* 2. MAÑANA: se reproduce en gafas sin regrabar */}
            <div className="relative space-y-1.5 group">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#D4AF37] border-2 border-white shadow-xs" />
              <div className="flex items-center space-x-2">
                <span className="font-editorial text-lg font-bold text-[#2C241E]">MANANA</span>
                <span className="text-[11px] font-semibold text-[#8C6D1F] bg-[#FAF7F2] border border-[#D4AF37]/40 px-2 py-0.5 rounded-md">Próxima generación</span>
              </div>
              <p className="text-sm font-semibold text-[#2C241E] font-sans">
                Se reproduce en gafas sin regrabar
              </p>
              <p className="text-xs text-[#6B5E55] leading-relaxed font-sans">
                Tu ser querido se pone sus gafas inteligentes (como Ray-Ban Meta) y el video se sincroniza automáticamente mediante Meta View. Lo vive como si estuvieras allí presente.
              </p>
            </div>

            {/* 3. FUTURO ORION: avatar holografico contesta */}
            <div className="relative space-y-1.5 group">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#D4AF37] border-2 border-[#FAF7F2]" />
              <div className="flex items-center space-x-2">
                <span className="font-editorial text-lg font-bold text-[#2C241E]">FUTURO ORION</span>
                <span className="text-[11px] font-semibold text-[#A88720] bg-[#FAF7F2] border border-[#D4AF37]/50 px-2 py-0.5 rounded-md shadow-xs">Holográfico</span>
              </div>
              <p className="text-sm font-semibold text-[#2C241E] font-sans">
                Avatar holográfico contesta
              </p>
              <p className="text-xs text-[#6B5E55] leading-relaxed font-sans">
                En gafas holográficas de visión espacial completa, el avatar entrenado con tus lecciones aparece sentado frente a ellos y responde a sus dudas con tu voz y principios morales.
              </p>
            </div>

          </div>

          {/* Box de certeza técnica */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#D4AF37]/35 space-y-1 text-xs text-[#6B5E55]">
            <div className="flex items-center space-x-1.5 text-[#2C241E] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Garantía de Compatibilidad Futura</span>
            </div>
            <p className="font-sans">
              No tienes que esperar a comprar tecnología cara. Grabar hoy en formato horizontal garantiza que nunca perderás la oportunidad de dejar tu legado.
            </p>
          </div>

        </div>

      </div>

      {/* VISTA HOLOGRAMA ORION (AVATAR SENTADO PLACEHOLDER) */}
      {showOrionHologram && (
        <div className="bg-[#1C1815] text-white rounded-2xl p-6 sm:p-10 border-2 border-[#D4AF37] shadow-soft-lg space-y-6 relative overflow-hidden animate-fadeIn">
          
          {/* Hologram Light Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Tag */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2 text-[#D4AF37]">
              <Sparkles className="w-5 h-5 animate-spin text-[#D4AF37]" style={{ animationDuration: '6s' }} />
              <span className="font-editorial text-lg font-bold text-white">
                Demostración: Vista Holograma Orion
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-black/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Proyección Espacial 3D · Avatar Sentado</span>
            </div>
          </div>

          {/* AVATAR SENTADO PLACEHOLDER CON EFECTOS HOLOGRÁFICOS */}
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center space-y-6 py-6">
            
            {/* Visual Hologram Container */}
            <div className="relative w-72 h-80 sm:w-80 sm:h-96 flex items-center justify-center">
              
              {/* Proyección inferior desde el suelo */}
              <div className="absolute bottom-0 w-56 h-10 bg-gradient-to-t from-[#D4AF37]/40 to-transparent rounded-full blur-md" />
              <div className="absolute bottom-2 w-44 h-4 border border-[#D4AF37]/60 rounded-full animate-pulse" />

              {/* Rayos holográficos verticales */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/15 via-transparent to-transparent pointer-events-none" />

              {/* SILUETA / AVATAR SENTADO PLACEHOLDER */}
              <div className="relative flex flex-col items-center justify-center space-y-3 z-10 group">
                
                {/* Holographic Figure Mockup (Persona sentada en sillón solemne) */}
                <div className="w-48 h-64 rounded-3xl bg-gradient-to-b from-[#2A221C] via-[#1E1915] to-[#120F0D] border border-[#D4AF37]/70 shadow-gold-subtle p-5 flex flex-col items-center justify-between backdrop-blur-md relative overflow-hidden">
                  
                  {/* Holographic Scanline Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37]/10 to-transparent animate-pulse pointer-events-none" />

                  {/* Cabeza / Rostro sereno */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#382D25] to-[#1E1915] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-editorial font-bold text-xl shadow-xs">
                    R
                  </div>

                  {/* Torso & Sillón clásico */}
                  <div className="text-center space-y-1">
                    <div className="text-xs font-editorial font-bold text-white tracking-wide">
                      Ricardo
                    </div>
                    <div className="text-[10px] text-[#D4AF37] font-mono">
                      Avatar Sentado · Sillón de Roble
                    </div>
                  </div>

                  {/* Estado de escucha en tiempo real */}
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-[#D4AF37]/60 text-[10px] text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Escuchando a Sofía</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Diálogo holográfico en vivo */}
            <div className="max-w-xl bg-black/70 p-5 rounded-2xl border border-[#D4AF37]/40 space-y-2 text-left shadow-soft">
              <div className="flex items-center justify-between text-xs text-[#D4AF37]">
                <span className="font-editorial font-semibold">Respuesta Holográfica en tu Sala:</span>
                <span className="font-mono text-[11px] text-slate-400">Gafas Orion FOV 70°</span>
              </div>
              <p className="font-editorial text-sm sm:text-base text-slate-200 leading-relaxed italic">
                "Sofía, siéntate aquí conmigo. Sé que estás asustada por el nuevo empleo, pero recuerda cómo superamos el año 2026. Tienes en tus manos el mismo valor que tenía tu abuela."
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
