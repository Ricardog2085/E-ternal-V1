import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Sparkles, 
  FileText, 
  Heart, 
  Check, 
  ShieldCheck, 
  Plus, 
  ChevronRight,
  Send
} from 'lucide-react';
import { FamilyMember } from '../types/eternal';

interface FamiliaTabProps {
  familyMembers: FamilyMember[];
  onAddMember: (member: FamilyMember) => void;
}

export const FamiliaTab: React.FC<FamiliaTabProps> = ({
  familyMembers,
  onAddMember,
}) => {
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('Hija');
  const [isSuccessFeedback, setIsSuccessFeedback] = useState(false);

  // Palette of warm, solemn colors for newly added members
  const colorPalette = ['#E8D5C4', '#D4AF37', '#9BB5CE', '#C9ADA7', '#D8C3A5', '#B8BEDD'];

  const handleAddQuickMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const trimmedName = newMemberName.trim();
    const initial = trimmedName.charAt(0).toUpperCase();
    const chosenColor = colorPalette[familyMembers.length % colorPalette.length];

    const newMember: FamilyMember = {
      id: `fam-${Date.now()}`,
      name: trimmedName,
      relation: newMemberRelation || 'Familiar',
      email: `${trimmedName.toLowerCase().replace(/\s+/g, '')}@legado-familiar.org`,
      isCustodian: false,
      assignedMemoriesCount: 0,
      status: 'Activo',
      avatarInitials: initial,
      avatarColor: chosenColor,
      note: 'Vínculo familiar resguardado en la bóveda de afectos.'
    };

    onAddMember(newMember);
    setNewMemberName('');
    setIsSuccessFeedback(true);
    setTimeout(() => setIsSuccessFeedback(false), 2500);
  };

  return (
    <div className="space-y-8 py-2">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#EFE8DE]">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#A88720]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>Círculo de Afectos & Herederos del Legado</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C241E] tracking-tight">
            Familia
          </h1>
          <p className="text-[#6B5E55] text-sm font-sans leading-relaxed pt-1">
            Los seres queridos que recibirán tus cartas, notas de voz y testimonios custodiados. Cada uno cuenta con un espacio personal en tu bóveda.
          </p>
        </div>
      </div>

      {/* INPUT NOMBRE Y BOTÓN AÑADIR FAMILIAR (Requerido) */}
      <div className="bg-white rounded-2xl p-6 border border-[#EFE8DE] shadow-soft">
        <form onSubmit={handleAddQuickMember} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              required
              placeholder="Escribe el nombre del familiar (ej. Mateo, Clara, Abuelo Juan)..."
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E8DEC8] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm text-[#2C241E] bg-[#FAF7F2] placeholder:text-[#9E9187] font-sans"
            />
          </div>

          <div className="w-full sm:w-44">
            <select
              value={newMemberRelation}
              onChange={(e) => setNewMemberRelation(e.target.value)}
              className="w-full px-3 py-3 rounded-xl border border-[#E8DEC8] focus:border-[#D4AF37] outline-none text-xs text-[#2C241E] bg-[#FAF7F2] font-sans"
            >
              <option value="Hija">Hija</option>
              <option value="Hijo">Hijo</option>
              <option value="Madre">Madre</option>
              <option value="Padre">Padre</option>
              <option value="Esposa">Esposa</option>
              <option value="Esposo">Esposo</option>
              <option value="Hermano">Hermano</option>
              <option value="Hermana">Hermana</option>
              <option value="Nieto/a">Nieto/a</option>
              <option value="Amigo cercano">Amigo cercano</option>
            </select>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#D4AF37] text-white hover:bg-[#C59B27] border border-[#D4AF37] shadow-gold-subtle text-xs sm:text-sm font-semibold transition-all flex-shrink-0"
          >
            {isSuccessFeedback ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>¡Familiar Añadido!</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 text-white" />
                <span>Añadir familiar</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* LISTA DE FAMILIARES CON AVATAR INICIAL CIRCULAR (Requerido) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            <Users className="w-4 h-4 text-[#D4AF37]" />
            <span>Miembros del Círculo Familiar ({familyMembers.length})</span>
          </div>
          <span className="text-xs text-[#8C7A6B]">Custodia activa</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {familyMembers.map((member) => {
            const avatarBg = member.avatarColor || '#E8D5C4';
            const initial = member.avatarInitials || member.name.charAt(0).toUpperCase();

            return (
              <div
                key={member.id}
                className="bg-white rounded-2xl p-5 border border-[#EFE8DE] hover:border-[#D4AF37]/80 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex items-center justify-between group"
              >
                <div className="flex items-center space-x-4">
                  {/* AVATAR INICIAL CIRCULAR CON SU COLOR EXACTO */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-editorial font-bold text-xl shadow-xs transition-transform duration-300 group-hover:scale-105 border-2 border-white ring-2 ring-[#EFE8DE] flex-shrink-0"
                    style={{ 
                      backgroundColor: avatarBg,
                      color: avatarBg === '#0F172A' ? '#FFFFFF' : '#2C241E'
                    }}
                  >
                    {initial}
                  </div>

                  {/* DATOS DEL FAMILIAR: Nombre, Parentesco, Cantidad de recuerdos */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-editorial text-lg font-bold text-[#2C241E] leading-none group-hover:text-[#A88720] transition-colors">
                        {member.name}
                      </h3>
                      {member.isCustodian && (
                        <span className="text-[10px] uppercase font-semibold text-[#A88720] bg-[#FAF7F2] border border-[#D4AF37]/40 px-2 py-0.5 rounded-md shadow-xs">
                          Custodio
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[#6B5E55] font-sans">
                      {member.relation}
                    </div>

                    <div className="inline-flex items-center space-x-1.5 text-xs text-[#8C7A6B] font-medium pt-0.5">
                      <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{member.assignedMemoriesCount} {member.assignedMemoriesCount === 1 ? 'recuerdo' : 'recuerdos'}</span>
                    </div>
                  </div>
                </div>

                {/* ACCIÓN LATERAL SUTIL */}
                <div className="flex items-center space-x-2 text-xs text-[#8C7A6B] group-hover:text-[#2C241E] transition-colors pr-2">
                  <span className="hidden sm:inline text-[11px] font-medium">Ver recuerdos</span>
                  <ChevronRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tarjeta solemne de custodia familiar en Cream & Gold */}
      <div className="bg-[#FAF7F2] text-[#2C241E] rounded-2xl p-6 sm:p-7 border border-[#D4AF37]/50 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#A88720]">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span className="uppercase tracking-widest">Compromiso Inalterable</span>
          </div>
          <p className="font-editorial text-base sm:text-lg text-[#4A3E34]">
            Cada miembro de tu familia tiene una llave única para acceder a los testimonios asignados en su momento.
          </p>
        </div>

        <div className="flex-shrink-0">
          <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white text-xs text-[#2C241E] border border-[#D4AF37]/40 shadow-xs">
            <span>Privacidad Cifrada</span>
            <span className="text-[#A88720] font-semibold">· E-ternal</span>
          </span>
        </div>
      </div>
    </div>
  );
};
