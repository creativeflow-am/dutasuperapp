
import React from 'react';
import { MeetingMinute } from '../types';

interface NotulensiCardProps {
  item: MeetingMinute;
  onEdit?: (item: MeetingMinute) => void;
  onDelete?: (id: string) => void;
}

const NotulensiCard: React.FC<NotulensiCardProps> = ({ item, onEdit, onDelete }) => {
  return (
    <div className="bg-[var(--g-surface)] p-6 rounded-[var(--g-radius)] border border-[var(--g-border)] hover:border-[var(--g-primary)]/40 transition-all shadow-[var(--g-shadow)] group mb-4">
      <div className="flex justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="text-base font-bold text-[var(--g-on-surface)] group-hover:text-[var(--g-primary)] transition-colors">{item.title}</span>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 bg-[var(--g-border)] rounded-full hidden sm:block"></span>
            <span className="text-[10px] text-[var(--g-on-surface-variant)] font-black uppercase tracking-widest">
              BY {item.author.split(' ')[0]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit?.(item)} className="w-9 h-9 rounded-xl bg-[var(--g-surface-variant)] border border-[var(--g-border)] flex items-center justify-center hover:bg-[var(--g-primary)] hover:text-black transition-all">
            <i className="fas fa-edit text-xs"></i>
          </button>
          <button onClick={() => onDelete?.(item.id)} className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
            <i className="fas fa-trash-alt text-xs"></i>
          </button>
          <div className="text-[10px] font-black text-[var(--g-on-surface-variant)] uppercase tracking-[0.2em] bg-[var(--g-surface-variant)] px-4 py-2 rounded-full border border-[var(--g-border)] shrink-0">
            {item.date}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-2xl md:text-3xl font-light text-[var(--g-on-surface)] leading-tight line-clamp-3 italic">
          "{item.summary || "Ringkasan agenda belum diinput."}"
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-[var(--g-on-surface-variant)] uppercase tracking-widest mt-auto border-t border-[var(--g-border)] pt-5">
         {/* Fix: Property 'filelink' does not exist on type 'MeetingMinute'. Did you mean 'fileLink'? */}
         {item.fileLink && item.fileLink !== '#' && (
           <a 
             href={item.fileLink} 
             target="_blank" 
             className="text-[var(--g-primary)] hover:brightness-90 flex items-center gap-2 py-3 px-6 bg-[var(--g-primary-container)] border border-[var(--g-primary)]/20 rounded-2xl shadow-xl transition-all font-bold"
           >
             <i className="fas fa-file-pdf text-sm"></i> BUKA NOTULENSI DRIVE
           </a>
         )}
         <span className="flex items-center gap-2 py-1 ml-auto opacity-40"><i className="fas fa-users-viewfinder"></i> OFFICIAL RECORD</span>
      </div>
    </div>
  );
};

export default NotulensiCard;