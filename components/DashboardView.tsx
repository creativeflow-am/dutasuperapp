
import React from 'react';
import { SocialMetric } from '../types';

interface DashboardViewProps {
  stats: {
    content: number;
    evidence: number;
    minutes: number;
    schedule: number;
    attendance: number;
    completedSchedules: number;
  };
  trendData: number[];
  performance: SocialMetric[];
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const DashboardView: React.FC<DashboardViewProps> = ({ stats, trendData, performance }) => {
  const maxTrend = Math.max(...trendData, 5);
  const height = 180;
  const width = 800;
  const padding = 50;
  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);

  const points = trendData.map((val, i) => {
    const x = padding + (i * (chartWidth / 11));
    const y = (height - padding) - (val / maxTrend * chartHeight);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Summary Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Konten Posted', val: stats.content, color: 'text-[var(--g-primary)]', icon: 'fa-clapperboard', bg: 'bg-blue-500/10', trend: '+12%' },
          { label: 'Laporan Valid', val: stats.evidence, color: 'text-green-500', icon: 'fa-check-double', bg: 'bg-green-500/10', trend: '+5%' },
          { label: 'Jadwal Aktif', val: stats.schedule, color: 'text-red-500', icon: 'fa-calendar-check', bg: 'bg-red-500/10', trend: 'Active' },
          { label: 'Total Absensi', val: stats.attendance, color: 'text-orange-500', icon: 'fa-fingerprint', bg: 'bg-orange-500/10', trend: 'Today' },
        ].map((item, i) => (
          <div key={i} className="p-5 bg-[var(--g-surface)] border border-[var(--g-border)] rounded-[24px] shadow-[var(--g-shadow)] group transition-all flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-3 right-3 text-[7px] font-black uppercase tracking-widest opacity-40">{item.trend}</div>
            <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} mb-3 group-hover:scale-110 transition-transform border border-current/10`}>
              <i className={`fas ${item.icon} text-base`}></i>
            </div>
            <p className="text-[9px] font-black text-[var(--g-on-surface-variant)] uppercase tracking-widest mb-1">{item.label}</p>
            <p className={`text-3xl font-black tracking-tighter ${item.color}`}>{item.val}</p>
          </div>
        ))}
      </div>

      {/* Main Activity Trend */}
      <div className="p-6 bg-[var(--g-surface)] rounded-[20px] border border-[var(--g-border)] shadow-[var(--g-shadow)] relative overflow-hidden">
        <div className="mb-8 flex justify-between items-start">
          <div>
             <h3 className="text-xs font-black text-[var(--g-primary)] uppercase tracking-widest mb-1">Growth & Activity Trend</h3>
             <p className="text-[11px] text-[var(--g-on-surface-variant)]">Monitoring produktivitas tim duta kampus 2026</p>
          </div>
          <div className="px-3 py-1 bg-[var(--g-surface-variant)] rounded-full text-[9px] font-black text-[var(--g-primary)] uppercase tracking-widest border border-[var(--g-border)]">
             Real-time Sync
          </div>
        </div>

        <div className="w-full overflow-x-auto no-scrollbar pb-2">
          <div className="min-w-[700px]">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-lg">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--g-primary)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--g-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--g-border)" strokeWidth="1" />
              <polyline points={areaPoints} fill="url(#chartGrad)" />
              <polyline points={points} fill="none" stroke="var(--g-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {trendData.map((val, i) => {
                const x = padding + (i * (chartWidth / 11));
                const y = (height - padding) - (val / maxTrend * chartHeight);
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="var(--g-surface)" stroke="var(--g-primary)" strokeWidth="2" />
                    <text x={x} y={height - 15} fill="var(--g-on-surface-variant)" fontSize="10" fontWeight="bold" textAnchor="middle">{MONTH_LABELS[i]}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Analytics Mini Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-[var(--g-surface)] rounded-[20px] border border-[var(--g-border)] shadow-[var(--g-shadow)]">
          <h4 className="text-[10px] font-black text-[var(--g-on-surface-variant)] uppercase tracking-widest mb-6">Audience Growth 2026</h4>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium">Total Impressions</span>
                <span className="font-bold text-[var(--g-primary)]">{(performance.reduce((a,b) => a + b.views, 0) / 1000).toFixed(1)}K</span>
              </div>
              <div className="h-2 w-full bg-[var(--g-surface-variant)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--g-primary)] w-[70%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium">Average Engagement</span>
                <span className="font-bold text-purple-500">
                  {((performance.reduce((a,b) => a + b.likes + b.comments, 0) / performance.length) || 0).toFixed(0)}
                </span>
              </div>
              <div className="h-2 w-full bg-[var(--g-surface-variant)] rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[55%]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[var(--g-surface)] rounded-[20px] border border-[var(--g-border)] shadow-[var(--g-shadow)] flex flex-col items-center justify-center text-center">
           <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4 border border-green-500/20">
              <i className="fas fa-shield-halved text-2xl text-green-500"></i>
           </div>
           <h5 className="text-[11px] font-bold uppercase tracking-widest mb-1">CreativeFlow Security</h5>
           <p className="text-[10px] text-[var(--g-on-surface-variant)] leading-relaxed max-w-[240px]">
              Platform dikonfigurasi untuk Tahun Anggaran 2026. 
              Data terenkripsi dan sinkronisasi Cloud Aktif.
           </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
