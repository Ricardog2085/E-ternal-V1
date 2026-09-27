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
  VolumeX 
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export type TabType = 'boveda' | 'familia' | 'entregas' | 'avatar' | 'futuro';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  memoriesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isAudioPlaying,
  onToggleAudio,
  memoriesCount,
}) => {
  const tabs = [
    { id: 'boveda', label: 'Bóveda', icon: Archive, badge: memoriesCount },
    { id: 'familia', label: 'Familia', icon: Users, badge: null },
    { id: 'entregas', label: 'Entregas', icon: Clock, badge: '4' },
    { id: 'avatar', label: 'Avatar', icon: Sparkles, badge: 'IA' },
    { id: 'futuro', label: 'Modo Futuro', icon: Compass, badge: '2050' },
  ] as const;

  return (
    <header className="bg-[#FAF7F2] text-[#2C241E] sticky top-0 z-40 border-b border-[#EFE8DE] shadow-soft">
      {/* Top subtle golden hairline */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3.5 cursor-pointer" onClick={() => setActiveTab('boveda')}>
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
                  Custodia
                </span>
              </div>
              <span className="text-xs text-[#6B5E55] tracking-wide font-light">
                Guardián de la Memoria
              </span>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-[#F3ECE2]/80 p-1.5 rounded-2xl border border-[#E8DEC8]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-[#2C241E] shadow-soft border border-[#D4AF37]/60'
                      : 'text-[#6B5E55] hover:text-[#2C241E] hover:bg-white/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#D4AF37]' : 'text-[#8C7A6B]'
                    }`}
                  />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-[#D4AF37]/15 text-[#947113] font-bold'
                          : 'bg-[#EAE0D2] text-[#6B5E55]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#D4AF37] rounded-full" />
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

            {/* Profile / Vault Protocol Tag */}
            <div className="hidden lg:flex items-center space-x-2.5 pl-2 border-l border-[#E0D4C3]">
              <div className="w-8 h-8 rounded-full bg-white border border-[#D4AF37] flex items-center justify-center text-xs font-editorial text-[#947113] font-bold shadow-xs">
                EM
              </div>
              <div className="text-left text-xs">
                <div className="text-[#2C241E] font-medium leading-none">Enrique Morales</div>
                <div className="text-[11px] text-emerald-800 flex items-center space-x-1 mt-0.5 font-medium">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Bóveda Activa</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Mobile Tabs Bar */}
        <div className="md:hidden flex items-center justify-around py-2.5 border-t border-[#EFE8DE] bg-[#FAF7F2] overflow-x-auto space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-xs font-medium ${
                  isActive ? 'text-[#A88720] font-bold' : 'text-[#6B5E55]'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-[#D4AF37]' : 'text-[#8C7A6B]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
