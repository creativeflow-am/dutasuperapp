
import React, { useState, useMemo, useEffect } from 'react';
import { ContentStatus, Platform, ContentItem, ViewMode, MeetingMinute, AttendanceRecord, WeeklyReport, Notification, ActivityCategory, SocialMetric, ScheduleAssignment, AmbassadorProfile, ReportStatus } from './types';
import { ASSIGNEES, AMBASSADOR_PROFILES, MOCK_SOCIAL_METRICS } from './constants';
import ContentCard from './components/ContentCard';
import NotulensiCard from './components/NotulensiCard';
import AttendanceModule from './components/AttendanceModule';
import EvidenceCard from './components/EvidenceCard';
import SocialMetricCard from './components/SocialMetricCard';
import ScheduleCard from './components/ScheduleCard';
import MemberCard from './components/MemberCard';
import DashboardView from './components/DashboardView';
import Toast from './components/Toast';
import { optimizeCaption, generateDraft } from './services/geminiService';
import { fetchSheetData, saveSheetData, updateSheetData, deleteSheetData } from './services/googleSheetService';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('Dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // States
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [minutesItems, setMinutesItems] = useState<MeetingMinute[]>([]);
  const [reportItems, setReportItems] = useState<WeeklyReport[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<SocialMetric[]>(MOCK_SOCIAL_METRICS);
  const [scheduleItems, setScheduleItems] = useState<ScheduleAssignment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [activeTab, setActiveTab] = useState<ContentStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ViewMode | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isAiWorking, setIsAiWorking] = useState(false);

  const syncAllData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        fetchSheetData('Content'), fetchSheetData('Evidence'), fetchSheetData('Minutes'),
        fetchSheetData('Schedules'), fetchSheetData('Attendance'), fetchSheetData('Performance')
      ]);

      const [content, reports, minutes, schedules, attendance, performance] = results.map(r => 
        r.status === 'fulfilled' ? r.value : null
      );

      // Cek apakah ada yang gagal total
      const failedCount = results.filter(r => r.status === 'rejected').length;
      
      if (content) setContentItems(content);
      if (reports) setReportItems(reports);
      if (minutes) setMinutesItems(minutes);
      if (schedules) setScheduleItems(schedules);
      if (attendance) setAttendanceLogs(attendance);
      if (performance && performance.length > 0) setPerformanceMetrics(performance);
      
      if (failedCount === results.length) {
        throw new Error("Semua tab gagal dimuat. Periksa API_URL dan Tab Spreadsheet.");
      }

      setIsCloudConnected(true);
      if (!silent) {
        if (failedCount > 0) {
          notify(`${failedCount} Tab Gagal Sinkron. Cek Konsol.`, "warning");
        } else {
          notify("Database Cloud Sinkron", "success");
        }
      }
    } catch (e: any) { 
      setIsCloudConnected(false);
      notify(e.message || "Gagal Sinkron ke Cloud", "warning"); 
      console.error("[SyncError]", e);
    } finally { 
      if (!silent) setIsLoading(false); 
    }
  };

  useEffect(() => {
    syncAllData();
  }, []);

  const notify = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  const openAddModal = (type: ViewMode) => {
    setModalType(type);
    setEditingId(null);
    setFormData(getInitialData(type));
    setIsModalOpen(true);
  };

  const openEditModal = (type: ViewMode, item: any) => {
    setModalType(type);
    setEditingId(item.id);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const getInitialData = (type: ViewMode) => {
    const today = new Date().toISOString().split('T')[0];
    if (type === 'Content') return { platform: 'Instagram', assignee: ASSIGNEES[0], deadline: today, status: ContentStatus.IDEATION };
    if (type === 'Evidence') return { category: 'Produksi Konten', ambassadorname: ASSIGNEES[0], status: 'Proses Cek', date: today };
    if (type === 'Notulensi') return { author: ASSIGNEES[0], date: today };
    if (type === 'Jadwal') return { priority: 'Medium', category: 'Sosialisasi', date: today, ambassadornames: [] };
    if (type === 'Performance') return { month: 'Jan', likes: 0, comments: 0, views: 0, shares: 0 };
    return {};
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const type = modalType as ViewMode;
    const tabName = type === 'Evidence' ? 'Evidence' : type === 'Notulensi' ? 'Minutes' : type === 'Jadwal' ? 'Schedules' : type;
    
    // Normalisasi kunci ke lowercase agar sesuai backend robust
    const normalizedData: any = {};
    Object.keys(formData).forEach(k => { normalizedData[k.toLowerCase()] = formData[k]; });
    
    const finalItem = { ...normalizedData, id: editingId || Date.now().toString() };
    
    setIsLoading(true);
    try {
      if (editingId) {
        if (type === 'Content') setContentItems(p => p.map(i => i.id === editingId ? finalItem : i));
        if (type === 'Evidence') setReportItems(p => p.map(i => i.id === editingId ? finalItem : i));
        if (type === 'Notulensi') setMinutesItems(p => p.map(i => i.id === editingId ? finalItem : i));
        if (type === 'Jadwal') setScheduleItems(p => p.map(i => i.id === editingId ? finalItem : i));
        if (type === 'Performance') setPerformanceMetrics(p => p.map(i => i.id === editingId ? finalItem : i));
        await updateSheetData(tabName, editingId, finalItem);
      } else {
        if (type === 'Content') setContentItems(p => [finalItem, ...p]);
        if (type === 'Evidence') setReportItems(p => [finalItem, ...p]);
        if (type === 'Notulensi') setMinutesItems(p => [finalItem, ...p]);
        if (type === 'Jadwal') setScheduleItems(p => [finalItem, ...p]);
        if (type === 'Performance') setPerformanceMetrics(p => [finalItem, ...p]);
        await saveSheetData(tabName, finalItem);
      }
      notify("Berhasil Disimpan", "success");
    } catch (err) {
      notify("Gagal Sinkron", "warning");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (type: ViewMode, id: string) => {
    if (!window.confirm("Hapus data ini dari Cloud?")) return;
    const tabName = type === 'Evidence' ? 'Evidence' : type === 'Notulensi' ? 'Minutes' : type === 'Jadwal' ? 'Schedules' : type;
    
    setIsLoading(true);
    try {
      if (type === 'Content') setContentItems(p => p.filter(i => i.id !== id));
      if (type === 'Evidence') setReportItems(p => p.filter(i => i.id !== id));
      if (type === 'Notulensi') setMinutesItems(p => p.filter(i => i.id !== id));
      if (type === 'Jadwal') setScheduleItems(p => p.filter(i => i.id !== id));
      // Fixed: Removed 'as any' since id is now part of SocialMetric interface
      if (type === 'Performance') setPerformanceMetrics(p => p.filter(i => i.id !== id));
      await deleteSheetData(tabName, id);
      notify("Data Terhapus", "success");
    } catch (err) {
      notify("Gagal Hapus", "warning");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiOptimize = async () => {
    if (!formData.title) return notify("Judul diperlukan untuk AI", "warning");
    setIsAiWorking(true);
    try {
      const optimized = await optimizeCaption(formData.title, formData.caption || "", formData.platform || "Instagram");
      setFormData({ ...formData, caption: optimized });
      notify("Caption Dioptimasi AI", "success");
    } catch (e) {
      notify("AI Error", "warning");
    } finally {
      setIsAiWorking(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, [key]: reader.result as string });
        notify("File siap di-upload ke Drive", "info");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonnelToggle = (name: string) => {
    const current = Array.isArray(formData.ambassadornames) ? formData.ambassadornames : 
                     (typeof formData.ambassadornames === 'string' && formData.ambassadornames !== "" ? formData.ambassadornames.split(', ') : []);
    
    const updated = current.includes(name) ? current.filter(n => n !== name) : [...current, name];
    setFormData({ ...formData, ambassadornames: updated });
  };

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (viewMode === 'Content') return contentItems.filter(i => (i.title || '').toLowerCase().includes(q));
    if (viewMode === 'Evidence') return reportItems.filter(i => (i.activityTitle || '').toLowerCase().includes(q));
    if (viewMode === 'Notulensi') return minutesItems.filter(i => (i.title || '').toLowerCase().includes(q));
    if (viewMode === 'Jadwal') return scheduleItems.filter(i => (i.taskTitle || '').toLowerCase().includes(q));
    if (viewMode === 'Performance') return performanceMetrics;
    if (viewMode === 'Members') return AMBASSADOR_PROFILES.filter(m => (m.name || '').toLowerCase().includes(q));
    return [];
  }, [viewMode, contentItems, reportItems, minutesItems, scheduleItems, performanceMetrics, searchQuery]);

  return (
    <div className={`min-h-screen flex bg-[var(--g-bg)] text-[var(--g-on-surface)] ${theme === 'light' ? 'light-mode' : ''}`}>
      {isLoading && (
        <div className="fixed inset-0 z-[5000] bg-[var(--g-bg)]/80 backdrop-blur-sm flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[var(--g-primary)]/20 border-t-[var(--g-primary)] rounded-full animate-spin"></div>
        </div>
      )}

      {/* Sidebar Rail */}
      <aside className="sidebar-rail hidden md:flex">
        <div className="w-10 h-10 bg-[var(--g-primary)] rounded-xl flex items-center justify-center text-black mb-8 shadow-lg">
          <i className="fas fa-cubes text-lg"></i>
        </div>
        {[
          { id: 'Dashboard', label: 'Home', icon: 'fa-house' },
          { id: 'Jadwal', label: 'Jadwal', icon: 'fa-calendar-check' },
          { id: 'Absensi', label: 'Absen', icon: 'fa-fingerprint' },
          { id: 'Content', label: 'Konten', icon: 'fa-clapperboard' },
          { id: 'Evidence', label: 'Laporan', icon: 'fa-file-signature' },
          { id: 'Notulensi', label: 'Notulen', icon: 'fa-book' },
          { id: 'Performance', label: 'Stats', icon: 'fa-chart-line' },
          { id: 'Members', label: 'Team', icon: 'fa-users' },
        ].map(item => (
          <div key={item.id} onClick={() => setViewMode(item.id as ViewMode)} className={`sidebar-item ${viewMode === item.id ? 'active' : ''}`}>
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
          </div>
        ))}
      </aside>

      <div className="flex-1 md:pl-[72px] flex flex-col min-w-0">
        <header className="top-bar">
          <div className="hidden lg:flex font-black text-xl tracking-tighter">Creative<span className="text-[var(--g-primary)]">Flow</span></div>
          <div className="search-pill flex-1 mx-4">
            <i className="fas fa-search text-[var(--g-on-surface-variant)] text-xs"></i>
            <input type="text" placeholder={`Cari di ${viewMode}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => syncAllData()} 
              disabled={isLoading}
              className={`w-9 h-9 rounded-xl border border-[var(--g-border)] flex items-center justify-center transition-all ${isLoading ? 'opacity-50' : 'hover:bg-[var(--g-surface-variant)]'}`}
              title="Refresh Data"
            >
              <i className={`fas fa-sync-alt text-xs ${isLoading ? 'animate-spin' : ''}`}></i>
            </button>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-500 ${
                theme === 'dark' 
                  ? 'border-[var(--g-border)] bg-[var(--g-surface)] text-yellow-400 hover:bg-[var(--g-surface-variant)] hover:scale-105' 
                  : 'border-blue-200 bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 shadow-[0_2px_10px_-3px_rgba(37,99,235,0.2)]'
              }`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-sm ${theme === 'dark' ? 'animate-pulse' : ''}`}></i>
            </button>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${isCloudConnected ? 'border-green-500/20 text-green-500 bg-green-500/5' : 'border-red-500/20 text-red-500 bg-red-500/5'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isCloudConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              {isCloudConnected ? 'Cloud Active' : 'Offline'}
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-10 py-8 max-w-[1440px] mx-auto w-full pb-24">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tight">{viewMode}</h2>
            {['Content', 'Evidence', 'Notulensi', 'Jadwal', 'Performance'].includes(viewMode) && (
              <button onClick={() => openAddModal(viewMode as ViewMode)} className="bg-[var(--g-primary)] text-black px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2">
                <i className="fas fa-plus"></i> TAMBAH {viewMode}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {viewMode === 'Dashboard' && <DashboardView stats={{
              content: contentItems.length,
              evidence: reportItems.filter(r => r.status === 'Tervalidasi').length,
              minutes: minutesItems.length,
              schedule: scheduleItems.length,
              attendance: attendanceLogs.length,
              completedSchedules: 0
            }} trendData={performanceMetrics.map(p => p.views / 1000)} performance={performanceMetrics} />}

            {viewMode === 'Content' && filteredData.map((item: any) => (
              <ContentCard key={item.id} item={item} onStatusChange={async (id, s) => {
                setContentItems(p => p.map(i => i.id === id ? {...i, status: s} : i));
                await updateSheetData('Content', id, { status: s });
              }} onDelete={(id) => handleDelete('Content', id)} onEdit={(it) => openEditModal('Content', it)} />
            ))}

            {viewMode === 'Evidence' && filteredData.map((item: any) => (
              <EvidenceCard key={item.id} evidence={item} onStatusChange={async (id, s) => {
                setReportItems(p => p.map(i => i.id === id ? {...i, status: s} : i));
                await updateSheetData('Evidence', id, { status: s });
              }} onDelete={(id) => handleDelete('Evidence', id)} onEdit={(it) => openEditModal('Evidence', it)} />
            ))}

            {viewMode === 'Jadwal' && filteredData.map((item: any) => (
              <ScheduleCard key={item.id} item={item} onEdit={(it) => openEditModal('Jadwal', it)} onDelete={(id) => handleDelete('Jadwal', id)} />
            ))}

            {viewMode === 'Absensi' && <AttendanceModule onSave={async (r) => { setAttendanceLogs(p => [r, ...p]); await saveSheetData('Attendance', r); }} logs={attendanceLogs} />}

            {viewMode === 'Notulensi' && filteredData.map((item: any) => (
              <NotulensiCard key={item.id} item={item} onEdit={(it) => openEditModal('Notulensi', it)} onDelete={(id) => handleDelete('Notulensi', id)} />
            ))}

            {viewMode === 'Performance' && (
              <div className="grid grid-cols-1 gap-4">
                 {performanceMetrics.map((item: any, idx) => (
                    <SocialMetricCard key={idx} metric={item} />
                 ))}
              </div>
            )}

            {viewMode === 'Members' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredData.map((m: any, i: number) => <MemberCard key={i} member={m} />)}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CRUD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="bg-[var(--g-surface)] w-full max-w-xl rounded-[32px] border border-[var(--g-border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-[var(--g-border)] flex justify-between items-center bg-[var(--g-surface-variant)]">
              <h3 className="font-black text-sm uppercase tracking-[0.2em]">{editingId ? 'Edit' : 'Tambah'} {modalType}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-black/10 flex items-center justify-center"><i className="fas fa-times"></i></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6 custom-scrollbar">
              {modalType === 'Content' && (
                <>
                  <input required className="google-input w-full" placeholder="Judul Konten" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <select className="google-input w-full" value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})}><option>Instagram</option><option>TikTok</option><option>YouTube</option></select>
                    <select className="google-input w-full" value={formData.assignee} onChange={e => setFormData({...formData, assignee: e.target.value})}>{ASSIGNEES.map(a => <option key={a}>{a.split(' (')[0]}</option>)}</select>
                  </div>
                  <div className="relative">
                    <textarea className="google-input w-full" rows={6} placeholder="Caption" value={formData.caption || ''} onChange={e => setFormData({...formData, caption: e.target.value})}></textarea>
                    <button 
                      type="button" 
                      onClick={handleAiOptimize} 
                      disabled={isAiWorking}
                      className="absolute bottom-3 right-3 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isAiWorking ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-wand-sparkles"></i>}
                      {isAiWorking ? 'AI WORKING...' : 'AI OPTIMIZE'}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Drive Link Assets (Opsional):</label>
                    <input className="google-input w-full" placeholder="https://drive.google.com/..." value={formData.drivelink || ''} onChange={e => setFormData({...formData, drivelink: e.target.value})} />
                  </div>
                </>
              )}

              {modalType === 'Jadwal' && (
                <>
                  <input required className="google-input w-full" placeholder="Judul Tugas" value={formData.tasktitle || ''} onChange={e => setFormData({...formData, tasktitle: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="date" className="google-input w-full" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} />
                    <select className="google-input w-full" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}><option>Low</option><option>Medium</option><option>High</option></select>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <select className="google-input w-full" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option>Sosialisasi</option>
                      <option>Pelayanan Admisi</option>
                      <option>Produksi Konten</option>
                      <option>Event Kampus</option>
                      <option>Lainnya</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Personel Bertugas (Pilih Lengkap):</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto p-4 border border-[var(--g-border)] rounded-2xl bg-[var(--g-bg)]">
                      {ASSIGNEES.map(name => {
                        const isSelected = (Array.isArray(formData.ambassadornames) ? formData.ambassadornames : 
                                           (typeof formData.ambassadornames === 'string' && formData.ambassadornames !== "" ? formData.ambassadornames.split(', ') : [])).includes(name);
                        return (
                          <label key={name} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-[var(--g-primary-container)] border-[var(--g-primary)]/40' : 'bg-[var(--g-surface)] border-transparent'}`}>
                            <input 
                              type="checkbox" 
                              checked={isSelected} 
                              onChange={() => handlePersonnelToggle(name)}
                              className="w-4 h-4 rounded border-[var(--g-border)] bg-transparent text-[var(--g-primary)] focus:ring-0"
                            />
                            <div className="flex flex-col min-w-0">
                              <span className="text-[10px] font-bold truncate">{name.split(' (')[0]}</span>
                              <span className="text-[8px] opacity-60 font-black">{name.includes('(') ? name.split('(')[1].replace(')', '') : 'ANGGOTA'}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  
                  <input className="google-input w-full" placeholder="Lokasi Penugasan" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} />
                </>
              )}

              {modalType === 'Notulensi' && (
                <>
                  <input required className="google-input w-full" placeholder="Judul Rapat" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="date" className="google-input w-full" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} />
                    <select className="google-input w-full" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})}>{ASSIGNEES.map(a => <option key={a}>{a.split(' (')[0]}</option>)}</select>
                  </div>
                  <textarea className="google-input w-full" rows={6} placeholder="Ringkasan Notulensi" value={formData.summary || ''} onChange={e => setFormData({...formData, summary: e.target.value})}></textarea>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Upload File Notulensi (PDF/Gambar):</label>
                    <input type="file" accept="image/*,application/pdf" className="google-input w-full text-xs" onChange={e => handleFileChange(e, 'filelink')} />
                    {formData.filelink && formData.filelink.startsWith('data:') && <p className="text-[8px] text-green-500 font-bold">FILE TERPILIH (SIAP UPLOAD)</p>}
                    <input className="google-input w-full mt-2" placeholder="Atau tempel Link Drive..." value={formData.filelink && !formData.filelink.startsWith('data:') ? formData.filelink : ''} onChange={e => setFormData({...formData, filelink: e.target.value})} />
                  </div>
                </>
              )}

              {modalType === 'Evidence' && (
                <>
                  <input required className="google-input w-full" placeholder="Judul Kegiatan" value={formData.activitytitle || ''} onChange={e => setFormData({...formData, activitytitle: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <select className="google-input w-full" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option>Sosialisasi</option>
                      <option>Pelayanan Admisi</option>
                      <option>Produksi Konten</option>
                      <option>Event Kampus</option>
                      <option>Lainnya</option>
                    </select>
                    <select className="google-input w-full" value={formData.ambassadorname} onChange={e => setFormData({...formData, ambassadorname: e.target.value})}>{ASSIGNEES.map(a => <option key={a}>{a.split(' (')[0]}</option>)}</select>
                  </div>
                  <input type="date" className="google-input w-full" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} />
                  <textarea className="google-input w-full" rows={4} placeholder="Deskripsi Kegiatan" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Upload Bukti PDF/Gambar:</label>
                    <input type="file" accept="image/*,application/pdf" className="google-input w-full text-xs" onChange={e => handleFileChange(e, 'pdfurl')} />
                    {formData.pdfurl && <p className="text-[8px] text-green-500 font-bold">FILE TERPILIH (SIAP UPLOAD)</p>}
                  </div>
                </>
              )}

              {modalType === 'Performance' && (
                <div className="space-y-4">
                  <select className="google-input w-full" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})}>
                    {['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'].map(m => <option key={m}>{m}</option>)}
                  </select>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" className="google-input w-full" placeholder="Views" value={formData.views || ''} onChange={e => setFormData({...formData, views: parseInt(e.target.value)})} />
                    <input type="number" className="google-input w-full" placeholder="Likes" value={formData.likes || ''} onChange={e => setFormData({...formData, likes: parseInt(e.target.value)})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" className="google-input w-full" placeholder="Shares" value={formData.shares || ''} onChange={e => setFormData({...formData, shares: parseInt(e.target.value)})} />
                    <input type="number" className="google-input w-full" placeholder="Comments" value={formData.comments || ''} onChange={e => setFormData({...formData, comments: parseInt(e.target.value)})} />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button type="submit" className="w-full py-5 bg-[var(--g-primary)] text-black rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:brightness-110 active:scale-95 transition-all">
                  {editingId ? 'SIMPAN PERUBAHAN' : 'TERBITKAN DATA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="fixed bottom-10 right-10 z-[3000] flex flex-col gap-3">
        {notifications.map(n => <Toast key={n.id} notification={n} onClose={removeNotification} />)}
      </div>
    </div>
  );
};

export default App;