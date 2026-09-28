import React from 'react';
import { 
  Infinity, 
  Archive, 
  Users, 
  Clock, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  Volume2, 
  VolumeX,
  User,
  BookOpen
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export type TabType = 
  | 'perfil' 
  | 'historia' 
  | 'recuerdos' 
  | 'multimedia' 
  | 'familia' 
  | 'entregas' 
  | 'futuro' 
  | 'boveda' 
  | 'avatar';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  memoriesCount: number;
  personName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isAudioPlaying,
  onToggleAudio,
  memoriesCount,
  personName = 'Enrique Morales',
}) => {
  // Normalizar identificadores de pestañas para compatibilidad
  const currentTab = activeTab === 'boveda' ? 'recuerdos' : activeTab === 'avatar' ? 'futuro' : activeTab;

  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: User, badge: null },
    { id: 'historia', label: 'Historia', icon: BookOpen, badge: null },
    { id: 'recuerdos', label: 'Recuerdos', icon: Archive, badge: memoriesCount },
    { id: 'multimedia', label: 'Multimedia', icon: Volume2, badge: null },
    { id: 'familia', label: 'Familia', icon: Users, badge: null },
    { id: 'entregas', label: 'Entregas', icon: Clock, badge: '4' },
    { id: 'futuro', label: 'Conversación Futura', icon: Sparkles, badge: 'IA' },
  ] as const;

  const initials = personName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('') || 'EM';

  return (
    <header className="bg-[#FAF7F2] text-[#2C241E] sticky top-0 z-40 border-b border-[#EFE8DE] shadow-soft">
      {/* Top subtle golden hairline */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3.5 cursor-pointer" onClick={() => setActiveTab('perfil')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-white border border-[#D4AF37]/50 shadow-soft group">
              <Infinity className="w-6 h-6 text-[#D4AF37] transition-transform duration-500 group-hover:scale-110" strokeWidth={2} />
              <div className="absolute inset-0 rounded-2xl bg-[#D4AF37]/10 blur-xs" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-editorial text-2xl font-bold tracking-tight text-[#2C241E]">
                  E-ternal
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#A88720] font-semibold px-1.5 py-0.5 rounded bg-[#FAF7F2] border border-[#D4AF37]/40 shadow-xs">
                  Persona & Bóveda
                </span>
              </div>
              <span className="text-xs text-[#6B5E55] tracking-wide font-light">
                Guardián de la Memoria
              </span>
            </div>
          </div>

          {/* Center Navigation Tabs (Estructura de la Persona) */}
          <nav className="hidden xl:flex items-center space-x-1 bg-[#F3ECE2]/80 p-1.5 rounded-2xl border border-[#E8DEC8]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-[#2C241E] shadow-soft border border-[#D4AF37]/60 font-semibold'
                      : 'text-[#6B5E55] hover:text-[#2C241E] hover:bg-white/60'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 transition-colors ${
                      isActive ? 'text-[#D4AF37]' : 'text-[#8C7A6B]'
                    }`}
                  />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-[#D4AF37]/15 text-[#947113] font-bold'
                          : 'bg-[#EAE0D2] text-[#6B5E55]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#D4AF37] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action & Ambient Sounds */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* PWA In-App Install Button */}
            <PWAInstallButton />

            {/* Ambient Sound Button */}
            <button
              onClick={onToggleAudio}
              title={isAudioPlaying ? 'Silenciar atmósfera sonora' : 'Activar atmósfera solemne'}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-2xl text-xs font-medium border transition-colors ${
                isAudioPlaying
                  ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#A88720] shadow-xs'
                  : 'border-[#E0D4C3] bg-white text-[#6B5E55] hover:text-[#2C241E] hover:border-[#D4AF37]'
              }`}
            >
              {isAudioPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#D4AF37]" />
                  <span className="hidden sm:inline font-semibold">Paz sonora</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#8C7A6B]" />
                  <span className="hidden sm:inline">Sonido</span>
                </>
              )}
            </button>

            {/* Profile / Vault Protocol Tag - Clickable to open 'perfil' */}
            <div 
              onClick={() => setActiveTab('perfil')}
              className="flex items-center space-x-2.5 pl-2 border-l border-[#E0D4C3] cursor-pointer group"
              title="Ver Perfil del Titular"
            >
              <div className="w-9 h-9 rounded-full bg-white border border-[#D4AF37] flex items-center justify-center text-xs font-editorial text-[#947113] font-bold shadow-xs group-hover:scale-105 transition-transform">
                {initials}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="text-[#2C241E] font-medium leading-none group-hover:text-[#A88720] transition-colors">{personName}</div>
                <div className="text-[10px] text-emerald-800 flex items-center space-x-1 mt-0.5 font-medium">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Titular Activo</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Scrollable Sub-bar for navigation on all screen sizes below xl */}
        <div className="xl:hidden flex items-center py-2 border-t border-[#EFE8DE] bg-[#FAF7F2] overflow-x-auto space-x-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-colors ${
                  isActive ? 'bg-white text-[#A88720] font-bold border border-[#D4AF37]/50 shadow-xs' : 'text-[#6B5E55] hover:text-[#2C241E]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-[#8C7A6B]'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] px-1 py-0.2 rounded-full bg-[#EAE0D2] font-mono text-[#6B5E55]">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
