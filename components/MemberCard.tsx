
import React from 'react';
import { AmbassadorProfile } from '../types';

interface MemberCardProps {
  member: AmbassadorProfile;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!member.whatsapp) return;
    const cleanPhone = member.whatsapp.startsWith('0') ? '62' + member.whatsapp.slice(1) : member.whatsapp;
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const handleEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!member.email) return;
    window.open(`mailto:${member.email}`, '_blank');
  };

  return (
    <div className="bg-[var(--g-surface)] p-5 rounded-[20px] border border-[var(--g-border)] hover:border-[var(--g-primary)] transition-all group shadow-[var(--g-shadow)] h-full flex flex-col">
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[var(--g-primary)]/10 rounded-xl flex items-center justify-center text-[var(--g-primary)] border border-[var(--g-primary)]/20 shadow-inner">
            <i className="fas fa-user-graduate text-xl"></i>
          </div>
          <div>
            <h4 className="text-[var(--g-on-surface)] font-bold text-sm leading-tight group-hover:text-[var(--g-primary)] transition-colors">{member.name}</h4>
            <p className="text-[9px] text-[var(--g-on-surface-variant)] font-black uppercase tracking-widest mt-1">SMT {member.semester} • {member.faculty}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6 flex-1">
        <div className="p-3 bg-[var(--g-surface-variant)] rounded-xl border border-[var(--g-border)]">
          <p className="text-[8px] font-black text-[var(--g-on-surface-variant)] uppercase tracking-widest mb-1">Program Studi</p>
          <p className="text-xs text-[var(--g-on-surface)] font-medium truncate">{member.major}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={handleWhatsApp}
          disabled={!member.whatsapp}
          className="flex-1 py-3 bg-green-500/10 hover:bg-green-500 hover:text-white border border-green-500/20 rounded-xl text-green-600 flex items-center justify-center gap-2 transition-all disabled:opacity-20 text-[10px] font-black uppercase tracking-widest px-2"
        >
          <i className="fab fa-whatsapp"></i> WhatsApp
        </button>
        <button 
          onClick={handleEmail}
          disabled={!member.email}
          className="flex-1 py-3 bg-[var(--g-primary)]/10 hover:bg-[var(--g-primary)] hover:text-black border border-[var(--g-primary)]/20 rounded-xl text-[var(--g-primary)] flex items-center justify-center gap-2 transition-all disabled:opacity-20 text-[10px] font-black uppercase tracking-widest px-2"
        >
          <i className="fas fa-envelope"></i> E-mail
        </button>
      </div>
    </div>
  );
};

export default MemberCard;
