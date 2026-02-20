
import React, { useState } from 'react';
import { ScheduleAssignment } from '../types';
import { AMBASSADOR_PROFILES } from '../constants';

interface ScheduleCardProps {
  item: ScheduleAssignment;
  onEdit?: (item: ScheduleAssignment) => void;
  onDelete?: (id: string) => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ item, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const priorityConfig = {
    Low: { color: 'border-green-500/40 text-green-500', accent: 'bg-green-500/10' },
    Medium: { color: 'border-yellow-500/40 text-yellow-500', accent: 'bg-yellow-500/10' },
    High: { color: 'border-red-500/40 text-red-500', accent: 'bg-red-500/10' }
  }[item.priority || 'Medium'];

  // Fix: Property 'ambassadornames' does not exist on type 'ScheduleAssignment'. Did you mean 'ambassadorNames'?
  const ambassadors = Array.isArray(item.ambassadorNames) ? item.ambassadorNames : 
                      typeof (item as any).ambassadorNames === 'string' ? ((item as any).ambassadorNames as string).split(', ') : [];
  
  const scheduleDate = new Date(item.date);
  const today = new Date();
  today.setHours(0,0,0,0);
  const isFinished = scheduleDate < today;

  const categoryConfig: Record<string, string> = {
    'Sosialisasi': 'border-blue-500/30 text-blue-500 bg-blue-500/5',
    'Pelayanan Admisi': 'border-purple-500/30 text-purple-500 bg-purple-500/5',
    'Produksi Konten': 'border-pink-500/30 text-pink-500 bg-pink-500/5',
    'Event Kampus': 'border-orange-500/30 text-orange-500 bg-orange-500/5',
    'Lainnya': 'border-gray-500/30 text-gray-500 bg-gray-500/5'
  };

  const handleRemind = (name: string) => {
    const profile = AMBASSADOR_PROFILES.find(p => name.includes(p.name));
    if (!profile || !profile.whatsapp) {
      alert("Kontak tidak tersedia untuk " + name);
      return;
    }
    const message = `Halo ${profile.name}! 👋\n\nIni pengingat penugasan dari *CreativeFlow Hub*:\n\n📌 *Tugas:* ${item.taskTitle}\n📂 *Kategori:* ${item.category}\n📍 *Lokasi:* ${item.location}\n📅 *Tanggal:* ${item.date}\n\nMohon kehadirannya tepat waktu. Semangat! 🔥`;
    window.open(`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className={`bg-[var(--g-surface)] p-6 rounded-[var(--g-radius)] border-l-4 border-y border-r border-[var(--g-border)] hover:border-[var(--g-primary)]/40 transition-all shadow-[var(--g-shadow)] mb-4 ${priorityConfig.color.split(' ')[0]}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-5">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm ${isFinished ? 'bg-gray-500/10 text-gray-500' : priorityConfig.accent}`}>
            <i className={`fas ${isFinished ? 'fa-circle-check' : 'fa-clock-rotate-left'}`}></i>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h4 className={`text-base font-bold transition-colors ${isFinished ? 'text-[var(--g-on-surface-variant)] line-through' : 'text-[var(--g-on-surface)]'}`}>{item.taskTitle}</h4>
              <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border transition-all ${categoryConfig[item.category || 'Lainnya'] || categoryConfig['Lainnya']}`}>
                {item.category || 'UMUM'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ambassadors.map(name => (
                <button 
                  key={name}
                  onClick={() => handleRemind(name)}
                  className="text-[9px] text-[var(--g-primary)] bg-[var(--g-primary)]/5 hover:bg-[var(--g-primary)] hover:text-white px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest transition-all border border-[var(--g-primary)]/20 shadow-sm"
                >
                  <i className="fab fa-whatsapp mr-1"></i> {name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto ml-auto">
           <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className={`text-[9px] font-black px-4 py-2 rounded-full uppercase border tracking-widest transition-all focus:outline-none ${isExpanded ? 'bg-[var(--g-primary)] text-black border-[var(--g-primary)]' : 'border-[var(--g-border)] text-[var(--g-on-surface-variant)] hover:border-[var(--g-primary)]'}`}
          >
            {isExpanded ? 'CLOSE' : 'VIEW'}
          </button>
           <button onClick={() => onEdit?.(item)} className="w-9 h-9 rounded-xl bg-[var(--g-surface-variant)] border border-[var(--g-border)] flex items-center justify-center hover:bg-[var(--g-primary)] hover:text-black transition-all">
            <i className="fas fa-edit text-xs"></i>
          </button>
          <button onClick={() => onDelete?.(item.id)} className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
            <i className="fas fa-trash-alt text-xs"></i>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="sm:pl-18 mb-6">
            <div className="flex items-center gap-2 mb-3 text-[var(--g-on-surface-variant)]">
              <i className="fas fa-location-dot text-xs text-[var(--g-primary)]"></i>
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">{item.location || 'Lokasi Kampus'}</span>
            </div>
            <p className={`text-lg md:text-xl font-light leading-relaxed ${isFinished ? 'text-[var(--g-on-surface-variant)] opacity-60' : 'text-[var(--g-on-surface)]'}`}>
              {item.description || "Petunjuk operasional penugasan rutin."}
            </p>
          </div>

          <div className="sm:pl-18 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] border-t border-[var(--g-border)] pt-5">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-3 ${isFinished ? 'text-gray-500' : 'text-[var(--g-primary)]'}`}>
                <i className="fas fa-calendar-alt"></i>
                <span>{item.date}</span>
              </div>
              <div className={`text-[10px] font-black uppercase tracking-[0.1em] px-4 py-1.5 rounded-full border shadow-sm ${isFinished ? 'border-gray-500/40 text-gray-500 bg-gray-500/5' : priorityConfig.color + ' ' + priorityConfig.accent}`}>
                {item.priority} PRIORITY
              </div>
            </div>
            <div className={`flex items-center gap-2 ${isFinished ? 'text-green-500' : 'text-blue-500'}`}>
              <i className={`fas ${isFinished ? 'fa-check-double' : 'fa-spinner animate-spin-slow'}`}></i> 
              {isFinished ? 'STATUS: SELESAI' : 'STATUS: AKTIF'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleCard;