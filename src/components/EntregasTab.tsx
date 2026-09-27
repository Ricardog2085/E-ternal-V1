import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  Video, 
  Volume2, 
  FileText, 
  Smartphone, 
  Glasses, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Check, 
  RefreshCw, 
  Lock, 
  ChevronRight,
  Radio
} from 'lucide-react';

interface TimelineDeliveryItem {
  id: string;
  title: string;
  dateOrEvent: string;
  type: 'Video' | 'Voz' | 'Carta';
  triggerLabel: string;
  triggerDescription: string;
  recipient: string;
  channelMobile: boolean;
  channelGlasses: boolean;
}

const INITIAL_TIMELINE_ITEMS: TimelineDeliveryItem[] = [
  {
    id: 'item-1',
    title: 'Cumpleaños 18 de Sofia',
    dateOrEvent: '12 Mar 2035',
    type: 'Video',
    triggerLabel: 'Trigger: Hito Cronológico (Mayoría de Edad)',
    triggerDescription: 'Se desbloqueará automáticamente a las 08:00 AM el día en que Sofía cumpla 18 años.',
    recipient: 'Sofia',
    channelMobile: true,
    channelGlasses: true,
  },
  {
    id: 'item-2',
    title: 'Cuando me extrañes',
    dateOrEvent: 'A demanda',
    type: 'Voz',
    triggerLabel: 'Trigger: Solicitud A Demanda de la Familia',
    triggerDescription: 'Disponible en cualquier instante en que un ser querido solicite escuchar la voz para encontrar calma.',
    recipient: 'Todos los seres queridos',
    channelMobile: true,
    channelGlasses: true,
  },
  {
    id: 'item-3',
    title: 'Navidad 2026',
    dateOrEvent: '24 Dic 2026',
    type: 'Carta',
    triggerLabel: 'Trigger: Festividad Familiar Calendada',
    triggerDescription: 'Apertura programada para la cena de Nochebuena de 2026 con lectura ceremonial.',
    recipient: 'Familia Morales',
    channelMobile: true,
    channelGlasses: true,
  },
  {
    id: 'item-4',
    title: 'Graduacion de Sofia',
    dateOrEvent: 'Evento futuro',
    type: 'Video',
    triggerLabel: 'Trigger: Certificación por Custodio',
    triggerDescription: 'Se liberará cuando el custodio primario certifique la obtención del título universitario.',
    recipient: 'Sofia',
    channelMobile: true,
    channelGlasses: true,
  },
  {
    id: 'item-5',
    title: 'Aniversario con Lucia',
    dateOrEvent: '14 Jun 2027',
    type: 'Voz',
    triggerLabel: 'Trigger: Fecha Conmemorativa Anual',
    triggerDescription: 'Entrega íntima para Lucía en la mañana del aniversario de boda.',
    recipient: 'Lucia',
    channelMobile: true,
    channelGlasses: true,
  },
];

interface EntregasTabProps {
  deliveries?: any[];
}

export const EntregasTab: React.FC<EntregasTabProps> = () => {
  const [items, setItems] = useState<TimelineDeliveryItem[]>(INITIAL_TIMELINE_ITEMS);
  const [pulseConfirmed, setPulseConfirmed] = useState(false);
  const [daysRemainingPulse, setDaysRemainingPulse] = useState(179);

  const toggleChannel = (id: string, channel: 'mobile' | 'glasses') => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            channelMobile: channel === 'mobile' ? !item.channelMobile : item.channelMobile,
            channelGlasses: channel === 'glasses' ? !item.channelGlasses : item.channelGlasses,
          };
        }
        return item;
      })
    );
  };

  const handleConfirmPulse = () => {
    setPulseConfirmed(true);
    setDaysRemainingPulse(180);
    setTimeout(() => setPulseConfirmed(false), 3500);
  };

  const getTypeIcon = (type: 'Video' | 'Voz' | 'Carta') => {
    switch (type) {
      case 'Video':
        return <Video className="w-4 h-4 text-[#D4AF37]" />;
      case 'Voz':
        return <Volume2 className="w-4 h-4 text-[#D4AF37]" />;
      case 'Carta':
        return <FileText className="w-4 h-4 text-[#D4AF37]" />;
    }
  };

  return (
    <div className="space-y-10 py-2">
      {/* Editorial Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#EFE8DE]">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#A88720]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>Línea Temporal Inalterable & Canales de Liberación</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C241E] tracking-tight">
            Protocolo de Entregas
          </h1>
          <p className="text-[#6B5E55] text-sm font-sans leading-relaxed pt-1">
            Visualización cronológica de cada memoria programada. Activa o desactiva la compatibilidad de transmisión entre dispositivos móviles y gafas inteligentes.
          </p>
        </div>

        {/* Latido de vida rápido */}
        <div className="flex-shrink-0">
          <button
            onClick={handleConfirmPulse}
            className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-semibold border transition-all ${
              pulseConfirmed
                ? 'bg-emerald-700 text-white border-emerald-600 shadow-xs'
                : 'bg-[#D4AF37] text-white hover:bg-[#C59B27] border-[#D4AF37] shadow-gold-subtle'
            }`}
          >
            {pulseConfirmed ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Latido Registrado ({daysRemainingPulse}d)</span>
              </>
            ) : (
              <>
                <Heart className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>Latido de Vida: Activo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* TIMELINE VERTICAL CON LÍNEA DORADA #D4AF37 */}
      <div className="relative max-w-4xl mx-auto py-4">
        
        {/* LÍNEA VERTICAL DORADA CONTINUA #D4AF37 */}
        <div 
          className="absolute left-6 sm:left-8 top-3 bottom-6 w-[3px] rounded-full shadow-gold-subtle z-0"
          style={{ backgroundColor: '#D4AF37' }}
        />

        {/* TIMELINE ITEMS */}
        <div className="space-y-8 relative z-10">
          {items.map((item) => {
            return (
              <div 
                key={item.id}
                className="relative flex items-start space-x-5 sm:space-x-8 group"
              >
                {/* TIMELINE NODE (CÍRCULO DORADO CON BORDES SOLEMNES) */}
                <div className="relative flex-shrink-0 mt-3 sm:mt-4 ml-3 sm:ml-5">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center border-4 border-white shadow-soft transition-transform duration-300 group-hover:scale-125"
                    style={{ backgroundColor: '#D4AF37' }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>

                {/* TIMELINE ITEM CARD */}
                <div className="flex-1 bg-white rounded-2xl p-6 border border-[#EFE8DE] hover:border-[#D4AF37]/80 shadow-soft hover:shadow-soft-lg transition-all duration-300 space-y-4">
                  
                  {/* HEADER DEL ITEM: Título, Tipo y Fecha/Evento */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFE8DE] pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-editorial text-xl sm:text-2xl font-bold text-[#2C241E] leading-tight group-hover:text-[#A88720] transition-colors">
                          {item.title}
                        </span>
                      </div>

                      <div className="text-xs text-[#6B5E55] font-sans">
                        Destinatario: <strong className="text-[#2C241E] font-medium">{item.recipient}</strong>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* TIPO: Video, Voz, Carta */}
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-[#A88720] border border-[#D4AF37]/40 shadow-xs">
                        {getTypeIcon(item.type)}
                        <span>{item.type}</span>
                      </span>

                      {/* FECHA / EVENTO */}
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold font-mono bg-[#FAF7F2] text-[#2C241E] border border-[#E8DEC8]">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{item.dateOrEvent}</span>
                      </span>
                    </div>
                  </div>

                  {/* TRIGGER LABEL & DESCRIPCIÓN */}
                  <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#D4AF37]/30 space-y-1">
                    <div className="flex items-center space-x-2 text-xs font-bold text-[#8C6D1F]">
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                      <span className="tracking-wide">{item.triggerLabel}</span>
                    </div>
                    <p className="text-xs text-[#6B5E55] font-sans leading-relaxed">
                      {item.triggerDescription}
                    </p>
                  </div>

                  {/* CANALES 📱 CELULAR Y 👓 GAFAS CON TOGGLE VISUAL */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
                      Canales de Transmisión Activos:
                    </div>

                    <div className="flex items-center space-x-3">
                      
                      {/* TOGGLE CANAL 📱 CELULAR */}
                      <button
                        type="button"
                        onClick={() => toggleChannel(item.id, 'mobile')}
                        className={`flex items-center space-x-2.5 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                          item.channelMobile
                            ? 'bg-[#FAF7F2] text-[#2C241E] border-[#D4AF37] shadow-xs ring-1 ring-[#D4AF37]/40 font-semibold'
                            : 'bg-white text-[#9E9187] border-[#E8DEC8]'
                        }`}
                        title="Alternar canal celular"
                      >
                        <span className="text-sm">📱</span>
                        <span>Celular</span>
                        
                        {/* TOGGLE SWITCH VISUAL */}
                        <div 
                          className={`w-7 h-4 rounded-full p-0.5 transition-colors flex items-center ${
                            item.channelMobile ? 'bg-[#D4AF37] justify-end' : 'bg-[#E8DEC8] justify-start'
                          }`}
                        >
                          <div className="w-3 h-3 rounded-full bg-white shadow-xs" />
                        </div>
                      </button>

                      {/* TOGGLE CANAL 👓 GAFAS */}
                      <button
                        type="button"
                        onClick={() => toggleChannel(item.id, 'glasses')}
                        className={`flex items-center space-x-2.5 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                          item.channelGlasses
                            ? 'bg-[#FAF7F2] text-[#2C241E] border-[#D4AF37] shadow-xs ring-1 ring-[#D4AF37]/40 font-semibold'
                            : 'bg-white text-[#9E9187] border-[#E8DEC8]'
                        }`}
                        title="Alternar canal gafas inteligentes"
                      >
                        <span className="text-sm">👓</span>
                        <span>Gafas</span>
                        
                        {/* TOGGLE SWITCH VISUAL */}
                        <div 
                          className={`w-7 h-4 rounded-full p-0.5 transition-colors flex items-center ${
                            item.channelGlasses ? 'bg-[#D4AF37] justify-end' : 'bg-[#E8DEC8] justify-start'
                          }`}
                        >
                          <div className="w-3 h-3 rounded-full bg-white shadow-xs" />
                        </div>
                      </button>

                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Nota solemne sobre las cláusulas temporales en Cream & Gold */}
      <div className="bg-[#FAF7F2] text-[#2C241E] rounded-2xl p-6 border border-[#D4AF37]/50 shadow-soft max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-xs flex-shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="font-editorial text-base font-bold text-[#2C241E]">Inviolabilidad de la Línea Temporal</div>
            <div className="text-xs text-[#6B5E55] font-sans">
              Ninguna memoria puede ser abierta antes de su trigger certificado o fecha pactada.
            </div>
          </div>
        </div>

        <div className="text-xs text-[#A88720] font-semibold border-l sm:border-l border-[#D4AF37]/40 pl-4">
          Línea de custodia garantizada
        </div>
      </div>
    </div>
  );
};
