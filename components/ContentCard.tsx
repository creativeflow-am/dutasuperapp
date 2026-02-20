
import React, { useState } from 'react';
import { ContentItem, ContentStatus } from '../types';
import { WORKFLOW } from '../constants';

interface ContentCardProps {
  item: ContentItem;
  onStatusChange?: (id: string, newStatus: ContentStatus) => void;
  onDelete?: (id: string) => void;
  onEdit?: (item: ContentItem) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, onStatusChange, onDelete, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusConfig = WORKFLOW.find(w => w.status === item.status) || WORKFLOW[0];

  return (
    <div className="bg-[var(--g-surface)] p-6 rounded-[24px] border border-[var(--g-border)] hover:border-[var(--g-primary)]/40 transition-all shadow-[var(--g-shadow)] mb-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--g-surface-variant)] flex items-center justify-center text-[var(--g-primary)] border border-[var(--g-border)] shadow-inner">
            <i className={item.platform === 'Instagram' ? 'fab fa-instagram text-xl' : item.platform === 'TikTok' ? 'fab fa-tiktok text-xl' : 'fab fa-youtube text-xl'}></i>
          </div>
          <div>
            <h4 className="text-base font-bold text-[var(--g-on-surface)] leading-none mb-1.5">{item.title}</h4>
            <p className="text-[10px] text-[var(--g-on-surface-variant)] font-black uppercase tracking-[0.2em]">{item.assignee.split(' ')[0]}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className={`text-[9px] font-black px-4 py-2 rounded-full uppercase border tracking-widest transition-all focus:outline-none ${isExpanded ? 'bg-[var(--g-primary)] text-black border-[var(--g-primary)]' : 'border-[var(--g-border)] text-[var(--g-on-surface-variant)] hover:border-[var(--g-primary)]'}`}
          >
            {isExpanded ? 'CLOSE' : 'VIEW'}
          </button>
          <button onClick={() => onEdit?.(item)} className="w-10 h-10 rounded-xl bg-[var(--g-surface-variant)] hover:bg-[var(--g-primary)] hover:text-black transition-all border border-[var(--g-border)] flex items-center justify-center">
            <i className="fas fa-edit text-xs"></i>
          </button>
          <button onClick={() => onDelete?.(item.id)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 flex items-center justify-center">
            <i className="fas fa-trash-alt text-xs"></i>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="mb-6 p-4 bg-[var(--g-surface-variant)] rounded-2xl border border-[var(--g-border)]">
            <p className="text-lg font-light text-[var(--g-on-surface)] leading-relaxed italic">
              "{item.caption || "Draft belum dibuat..."}"
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-[var(--g-border)]">
            <div className="flex items-center gap-4">
              <select 
                value={item.status} 
                onChange={(e) => onStatusChange?.(item.id, e.target.value as ContentStatus)}
                className={`text-[9px] font-black px-4 py-2 rounded-full uppercase border tracking-widest bg-transparent transition-all focus:outline-none ${statusConfig.color.replace('bg-', 'text-').replace('text-', 'border-')}`}
              >
                {Object.values(ContentStatus).map(status => (
                  <option key={status} value={status} className="bg-[var(--g-surface)] text-[var(--g-on-surface)]">{status.toUpperCase()}</option>
                ))}
              </select>
              <span className="text-[10px] font-black text-[var(--g-on-surface-variant)] uppercase tracking-widest flex items-center gap-2">
                <i className="fas fa-calendar-alt opacity-50"></i> {item.deadline || '-'}
              </span>
            </div>
            
            {item.driveLink && (
              <a href={item.driveLink} target="_blank" className="text-[10px] font-black text-[var(--g-primary)] uppercase tracking-widest hover:underline flex items-center gap-2 transition-colors">
                <i className="fas fa-link opacity-50"></i> DRIVE ASSETS
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCard;
