
import React from 'react';
import { SocialMetric } from '../types';

interface SocialMetricCardProps {
  metric: SocialMetric;
}

const SocialMetricCard: React.FC<SocialMetricCardProps> = ({ metric }) => {
  const maxViews = 100000;
  const viewWidth = Math.min((metric.views / maxViews) * 100, 100);

  return (
    <div className="bg-[var(--g-surface)] p-6 rounded-[20px] border border-[var(--g-border)] shadow-[var(--g-shadow)] hover:border-[var(--g-primary)]/40 transition-all group mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[var(--g-primary)]/10 rounded-xl flex items-center justify-center text-[var(--g-primary)] font-black text-lg border border-[var(--g-primary)]/20">
            {metric.month}
          </div>
          <div>
            <h4 className="text-[var(--g-on-surface)] font-bold text-sm uppercase tracking-wider">Laporan Performa</h4>
            <p className="text-[10px] text-[var(--g-on-surface-variant)] font-black uppercase tracking-widest">Periode 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-[9px] font-black text-[var(--g-on-surface-variant)] uppercase tracking-widest mb-1">Views</p>
            <p className="text-xl font-bold text-[var(--g-on-surface)]">{(metric.views / 1000).toFixed(1)}K</p>
          </div>
          <div className="text-center">
            <p className="text-[9px] font-black text-[var(--g-on-surface-variant)] uppercase tracking-widest mb-1">Likes</p>
            <p className="text-xl font-bold text-[var(--g-primary)]">{metric.likes}</p>
          </div>
          <div className="text-center">
            <p className="text-[9px] font-black text-[var(--g-on-surface-variant)] uppercase tracking-widest mb-1">Shares</p>
            <p className="text-xl font-bold text-emerald-500">{metric.shares}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end mb-1">
          <span className="text-[9px] font-bold text-[var(--g-on-surface-variant)] uppercase tracking-widest">Volume Traffic</span>
          <span className="text-[10px] text-[var(--g-primary)] font-black uppercase tracking-widest">{(metric.views/1000).toFixed(0)}% OF TARGET</span>
        </div>
        <div className="h-2 w-full bg-[var(--g-surface-variant)] rounded-full overflow-hidden border border-[var(--g-border)]">
           <div 
             className="h-full bg-[var(--g-primary)] transition-all duration-1000"
             style={{ width: `${viewWidth}%` }}
           ></div>
        </div>
      </div>
    </div>
  );
};

export default SocialMetricCard;
