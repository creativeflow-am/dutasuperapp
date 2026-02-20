
import React from 'react';
import { WeeklyReport, ReportStatus } from '../types';

interface EvidenceCardProps {
  evidence: WeeklyReport;
  onStatusChange?: (id: string, newStatus: ReportStatus) => void;
  onDelete?: (id: string) => void;
  onEdit?: (item: WeeklyReport) => void;
}

const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, onStatusChange, onDelete, onEdit }) => {
  const statusStyles = {
    'Proses Cek': 'border-yellow-500/40 text-yellow-500 bg-yellow-500/5',
    'Tidak Diterima': 'border-red-500/40 text-red-500 bg-red-500/5',
    'Tervalidasi': 'border-green-500/40 text-green-500 bg-green-500/5'
  }[evidence.status || 'Proses Cek'];

  return (
    <div className="bg-[var(--g-surface)] p-6 rounded-[24px] border border-[var(--g-border)] shadow-[var(--g-shadow)] hover:border-[var(--g-primary)]/40 transition-all mb-4">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[var(--g-surface-variant)] rounded-2xl flex items-center justify-center text-[var(--g-primary)] border border-[var(--g-border)] shadow-inner">
            <i className="fas fa-file-contract text-lg"></i>
          </div>
          <div>
            <h4 className="text-base font-bold text-[var(--g-on-surface)] leading-none mb-1.5">{evidence.activityTitle}</h4>
            <p className="text-[10px] text-[var(--g-on-surface-variant)] font-black uppercase tracking-widest">{evidence.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={evidence.status}
            onChange={(e) => onStatusChange?.(evidence.id, e.target.value as ReportStatus)}
            className={`text-[9px] font-black px-4 py-2 rounded-full uppercase border tracking-widest bg-transparent cursor-pointer transition-all ${statusStyles}`}
          >
            <option value="Proses Cek" className="bg-[var(--g-surface)]">Proses Cek</option>
            <option value="Tidak Diterima" className="bg-[var(--g-surface)]">Tidak Diterima</option>
            <option value="Tervalidasi" className="bg-[var(--g-surface)]">Tervalidasi</option>
          </select>
          <button onClick={() => onEdit?.(evidence)} className="w-9 h-9 rounded-xl bg-[var(--g-surface-variant)] border border-[var(--g-border)] flex items-center justify-center hover:bg-[var(--g-primary)] hover:text-black transition-all">
            <i className="fas fa-edit text-xs"></i>
          </button>
          <button onClick={() => onDelete?.(evidence.id)} className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 flex items-center justify-center">
            <i className="fas fa-trash-alt text-xs"></i>
          </button>
        </div>
      </div>

      <p className="text-lg font-light text-[var(--g-on-surface)] leading-relaxed mb-6 italic">
        "{evidence.description || 'Tidak ada rincian.'}"
      </p>

      <div className="flex flex-wrap items-center gap-5 text-[10px] font-black text-[var(--g-on-surface-variant)] uppercase tracking-widest border-t border-[var(--g-border)] pt-5">
         {/* Fix: Property 'pdfurl' does not exist on type 'WeeklyReport'. Did you mean 'pdfUrl'? */}
         {evidence.pdfUrl && evidence.pdfUrl !== '#' && (
           <a 
             href={evidence.pdfUrl} 
             target="_blank" 
             className="text-red-500 hover:bg-red-500 hover:text-white flex items-center gap-2 px-5 py-3 bg-red-500/10 rounded-2xl border border-red-500/20 transition-all font-bold shadow-lg"
           >
             <i className="fas fa-file-pdf"></i> LIHAT LAPORAN DRIVE
           </a>
         )}
         <div className="flex items-center gap-2 ml-auto">
            <i className="fas fa-user-circle opacity-50"></i>
            <span>{evidence.ambassadorName.split(' ')[0]}</span>
            <span className="opacity-40">•</span>
            <span>{evidence.date}</span>
         </div>
      </div>
    </div>
  );
};

export default EvidenceCard;