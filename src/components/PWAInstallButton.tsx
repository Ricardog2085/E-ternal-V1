import React, { useState } from 'react';
import { Download, Check, Share, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (!isInstallable) {
    return null;
  }

  const handleClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    const success = await installApp();
    if (success) {
      setInstalledSuccess(true);
      setTimeout(() => setInstalledSuccess(false), 3000);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        title="Instalar aplicación en tu dispositivo"
        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl text-xs font-medium border border-[#D4AF37]/50 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] transition-all shadow-xs"
      >
        {installedSuccess ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Instalada</span>
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Instalar App</span>
          </>
        )}
      </button>

      {/* iOS Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FFFFFF] text-[#0F172A] w-full max-w-sm rounded-2xl p-6 shadow-soft-lg border border-[#D4AF37]/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-editorial text-base font-bold">Instalar en tu iPhone o iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ol className="text-xs text-slate-600 space-y-2.5 font-sans list-decimal list-inside leading-relaxed">
              <li>
                Toca el botón <strong>Compartir</strong> <Share className="w-3.5 h-3.5 inline text-[#D4AF37]" /> en la barra inferior de Safari.
              </li>
              <li>
                Desplázate hacia abajo y selecciona <strong>"Añadir a la pantalla de inicio"</strong>.
              </li>
              <li>
                Confirma tocando <strong>"Añadir"</strong> arriba a la derecha.
              </li>
            </ol>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-semibold hover:bg-[#1E293B]"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
