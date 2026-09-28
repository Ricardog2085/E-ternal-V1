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
import { 
  getMemories as fetchDbMemories, 
  createMemory as createDbMemory, 
  deleteMemory as deleteDbMemory, 
  mapUiMemoryToDbMemoryData 
} from './services/memoryService';
import { 
  getPeople as fetchDbPeople, 
  createPerson as createDbPerson, 
  ensureOwnerPerson,
  familyMemberToPersonData 
} from './services/peopleService';
import { uploadMemoryMediaToSupabase } from './services/mediaService';
import { isSupabaseConfigured } from './lib/supabase';

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

  // Load initial data from Supabase Service Layer on mount
  useEffect(() => {
    let isMounted = true;

    async function initDatabaseLayer() {
      try {
        const [peopleFromDb, memoriesFromDb] = await Promise.all([
          fetchDbPeople(),
          fetchDbMemories(),
        ]);

        if (isMounted) {
          if (peopleFromDb && peopleFromDb.length > 0) {
            // Sincronizar personas en el estado familiar si no hay cambios locales previos
            console.info(`[E-Ternal] ${peopleFromDb.length} personas recuperadas de la capa de datos.`);
          }
          if (memoriesFromDb && memoriesFromDb.length > 0) {
            console.info(`[E-Ternal] ${memoriesFromDb.length} recuerdos recuperados de la capa de datos.`);
          }
        }
      } catch (err) {
        console.warn('[E-Ternal] Inicialización de servicios con persistencia local:', err);
      }
    }

    initDatabaseLayer();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to localStorage as temporary fallback
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

  const handleAddMemory = async (
    newMem: Memory,
    audioBlob?: Blob,
    audioMimeType?: string,
    durationSeconds?: number
  ) => {
    let ownerPersonId: string;
    let createdDbMemId: string = newMem.id;
    let signedAudioUrl: string | undefined = undefined;

    // 1. Obtener la persona principal (Owner) según supabase.auth.getUser()
    // Flujo requerido: auth.uid() -> people.user_id -> people.id
    const owner = await ensureOwnerPerson();
    ownerPersonId = owner.id;

    // 2. Crear el registro memories en Supabase
    const dbPayload = mapUiMemoryToDbMemoryData(newMem, ownerPersonId);

    // Buscar si el destinatario corresponde a un familiar registrado para vincular en memory_people
    const targetMember = familyMembers.find(
      (fam) => fam.name.toLowerCase() === newMem.recipient.toLowerCase()
    );
    const relatedPeopleIds = targetMember?.personId ? [targetMember.personId] : undefined;

    const createdMemory = await createDbMemory(dbPayload, relatedPeopleIds);
    createdDbMemId = createdMemory.id;

    // 3. Si hay audio grabado real, subir a Supabase Storage y registrar en media_assets
    if (audioBlob) {
      const uploadResult = await uploadMemoryMediaToSupabase({
        personId: ownerPersonId,
        memoryId: createdDbMemId,
        audioBlob,
        mimeType: audioMimeType || 'audio/mp4',
        durationSeconds,
      });
      signedAudioUrl = uploadResult.publicUrl;
    }

    // 4. Actualizar el objeto Memory para la UI con el ID real y la URL del audio
    const synchronizedMem: Memory = {
      ...newMem,
      id: createdDbMemId,
      dbId: createdDbMemId,
      authorPersonId: ownerPersonId,
      audioUrl: signedAudioUrl || newMem.audioUrl,
    };

    // Actualización de estado en UI
    setMemories((prev) => [synchronizedMem, ...prev]);

    // 5. Actualizar contador del familiar en el círculo de afectos
    setFamilyMembers((prev) =>
      prev.map((fam) => {
        if (fam.name.toLowerCase() === synchronizedMem.recipient.toLowerCase()) {
          return { ...fam, assignedMemoriesCount: fam.assignedMemoriesCount + 1 };
        }
        return fam;
      })
    );

    // 6. Crear registro en calendario temporal de entregas
    const newDelivery: DeliverySchedule = {
      id: `del-${Date.now()}`,
      memoryId: synchronizedMem.id,
      memoryTitle: synchronizedMem.title,
      recipientName: synchronizedMem.recipient,
      relation: synchronizedMem.recipientRelation,
      triggerType: synchronizedMem.releaseDate ? 'fecha' : 'hito',
      triggerLabel: synchronizedMem.releaseCondition,
      scheduledYear: synchronizedMem.releaseDate ? new Date(synchronizedMem.releaseDate).getFullYear() || 2030 : 2030,
      scheduledDateFormatted: synchronizedMem.releaseDate || 'Hito Vital',
      status: 'Programada',
      custodiansRequired: synchronizedMem.securityLevel === 'Doble Llave' ? 2 : 1,
      custodiansConfirmed: 1,
    };
    setDeliveries((prev) => [newDelivery, ...prev]);
  };

  const handleDeleteMemory = async (id: string) => {
    const memToDelete = memories.find((m) => m.id === id);
    setMemories((prev) => prev.filter((m) => m.id !== id));

    // Persistencia en capa de servicio Supabase
    try {
      await deleteDbMemory(id);
    } catch (err) {
      console.warn('[E-Ternal] Error eliminando recuerdo en memoryService:', err);
    }

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

  const handleAddFamilyMember = async (newMember: FamilyMember) => {
    // 1. Actualización en UI
    setFamilyMembers((prev) => [...prev, newMember]);

    // 2. Persistencia en la capa de datos (Supabase / PeopleService)
    try {
      const personData = familyMemberToPersonData(newMember);
      await createDbPerson(personData);
    } catch (err) {
      console.warn('[E-Ternal] Error guardando persona en peopleService:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C241E] flex flex-col font-sans selection:bg-[#D4AF37]/25 selection:text-[#2C241E]">
      {/* Header with Infinity Logo, Tabs, and PWA Install */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAudioPlaying={isAudioActive}
        onToggleAudio={handleToggleAudio}
        memoriesCount={memories.length}
      />

      {/* Main Content Area */}
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

      {/* Reader Modal */}
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
