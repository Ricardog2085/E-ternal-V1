/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, TabType } from './components/Header';
import { BovedaTab } from './components/BovedaTab';
import { FamiliaTab } from './components/FamiliaTab';
import { EntregasTab } from './components/EntregasTab';
import { AvatarTab } from './components/AvatarTab';
import { ModoFuturoTab } from './components/ModoFuturoTab';
import { MemoryReaderModal } from './components/MemoryReaderModal';
import { 
  INITIAL_MEMORIES, 
  INITIAL_FAMILY, 
  INITIAL_DELIVERIES 
} from './data/initialData';
import { Memory, FamilyMember, DeliverySchedule } from './types/eternal';
import { toggleAmbientSound } from './utils/audioAmbience';
import { ShieldCheck, Infinity, Feather } from 'lucide-react';

const STORAGE_KEYS = {
  MEMORIES: 'eternal_memories_v1',
  FAMILY: 'eternal_family_v1',
  DELIVERIES: 'eternal_deliveries_v1',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('boveda');

  // Load from localStorage with fallback to initial data
  const [memories, setMemories] = useState<Memory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_MEMORIES;
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAMILY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_FAMILY;
  });

  const [deliveries, setDeliveries] = useState<DeliverySchedule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DELIVERIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_DELIVERIES;
  });

  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [selectedModalMemory, setSelectedModalMemory] = useState<Memory | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
    } catch {
      // ignore
    }
  }, [memories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(familyMembers));
    } catch {
      // ignore
    }
  }, [familyMembers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(deliveries));
    } catch {
      // ignore
    }
  }, [deliveries]);

  const handleToggleAudio = () => {
    const newState = toggleAmbientSound((playing) => {
      setIsAudioActive(playing);
    });
    setIsAudioActive(newState);
  };

  const handleAddMemory = (newMem: Memory) => {
    setMemories((prev) => [newMem, ...prev]);

    // Update memory count for recipient in family circle
    setFamilyMembers((prev) =>
      prev.map((fam) => {
        if (fam.name.toLowerCase() === newMem.recipient.toLowerCase()) {
          return { ...fam, assignedMemoriesCount: fam.assignedMemoriesCount + 1 };
        }
        return fam;
      })
    );

    // If it has a release condition or date, also create a delivery schedule item
    const newDelivery: DeliverySchedule = {
      id: `del-${Date.now()}`,
      memoryId: newMem.id,
      memoryTitle: newMem.title,
      recipientName: newMem.recipient,
      relation: newMem.recipientRelation,
      triggerType: newMem.releaseDate ? 'fecha' : 'hito',
      triggerLabel: newMem.releaseCondition,
      scheduledYear: newMem.releaseDate ? new Date(newMem.releaseDate).getFullYear() || 2030 : 2030,
      scheduledDateFormatted: newMem.releaseDate || 'Hito Vital',
      status: 'Programada',
      custodiansRequired: newMem.securityLevel === 'Doble Llave' ? 2 : 1,
      custodiansConfirmed: 1,
    };
    setDeliveries((prev) => [newDelivery, ...prev]);
  };

  const handleDeleteMemory = (id: string) => {
    const memToDelete = memories.find((m) => m.id === id);
    setMemories((prev) => prev.filter((m) => m.id !== id));

    if (memToDelete) {
      setFamilyMembers((prev) =>
        prev.map((fam) => {
          if (fam.name.toLowerCase() === memToDelete.recipient.toLowerCase()) {
            return { ...fam, assignedMemoriesCount: Math.max(0, fam.assignedMemoriesCount - 1) };
          }
          return fam;
        })
      );
    }
  };

  const handleAddFamilyMember = (newMember: FamilyMember) => {
    setFamilyMembers((prev) => [...prev, newMember]);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C241E] flex flex-col font-sans selection:bg-[#D4AF37]/25 selection:text-[#2C241E]">
      {/* Dark Header with Infinity Logo, Tabs, and PWA Install */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAudioPlaying={isAudioActive}
        onToggleAudio={handleToggleAudio}
        memoriesCount={memories.length}
      />

      {/* Main Content Area with generous breathing space ("mucho aire") */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeTab === 'boveda' && (
          <BovedaTab
            memories={memories}
            onAddMemory={handleAddMemory}
            onDeleteMemory={handleDeleteMemory}
            familyMembers={familyMembers}
          />
        )}

        {activeTab === 'familia' && (
          <FamiliaTab
            familyMembers={familyMembers}
            onAddMember={handleAddFamilyMember}
          />
        )}

        {activeTab === 'entregas' && (
          <EntregasTab deliveries={deliveries} />
        )}

        {activeTab === 'avatar' && (
          <AvatarTab memories={memories} />
        )}

        {activeTab === 'futuro' && (
          <ModoFuturoTab
            memories={memories}
            onOpenMemory={(mem) => setSelectedModalMemory(mem)}
          />
        )}
      </main>

      {/* Reader Modal (if opened globally from Modo Futuro or alerts) */}
      <MemoryReaderModal
        memory={selectedModalMemory}
        onClose={() => setSelectedModalMemory(null)}
      />

      {/* Premium Solemn Editorial Footer in Cream, Gold & White */}
      <footer className="bg-[#FAF7F2] text-[#2C241E] border-t border-[#EFE8DE] mt-16 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#EFE8DE] text-center md:text-left">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('boveda')}>
              <div className="w-10 h-10 rounded-2xl bg-white border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-soft">
                <Infinity className="w-5 h-5" />
              </div>
              <div>
                <span className="font-editorial text-xl font-bold text-[#2C241E] tracking-tight">
                  E-ternal
                </span>
                <span className="text-xs text-[#6B5E55] block font-light">
                  Guardián de la Memoria · Bóveda Cifrada
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#6B5E55] font-sans">
              <span className="flex items-center space-x-1.5 text-[#2C241E] font-medium">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Cifrado Fraccionado</span>
              </span>
              <span>·</span>
              <span>Custodia Testamentaria</span>
              <span>·</span>
              <span>Inviolabilidad Criptográfica</span>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C7A6B]">
            <p className="font-sans">
              © {new Date().getFullYear()} E-ternal. Diseñado para trascender en el tiempo con dignidad y afecto.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-[#A88720] font-medium">
              <Feather className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-editorial italic">"Recordar es volver a pasar por el corazón."</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
