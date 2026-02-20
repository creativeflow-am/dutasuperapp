
import React, { useState, useRef } from 'react';
import { ASSIGNEES } from '../constants';
import { AttendanceRecord } from '../types';

interface AttendanceModuleProps {
  onSave: (record: AttendanceRecord) => void;
  logs: AttendanceRecord[];
}

const AttendanceModule: React.FC<AttendanceModuleProps> = ({ onSave, logs }) => {
  const [selectedName, setSelectedName] = useState(ASSIGNEES[0]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [attendanceType, setAttendanceType] = useState<'In' | 'Out'>('In');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const openCameraModal = async () => {
    setIsCameraOpen(true);
    await startCamera(facingMode);
    getLocation();
  };

  const closeCameraModal = () => {
    stopCamera();
    setIsCameraOpen(false);
    setPhoto(null);
  };

  const startCamera = async (mode: 'user' | 'environment') => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: mode, 
          width: { ideal: 1920 }, 
          height: { ideal: 1080 },
          aspectRatio: { ideal: 1.7777777778 }
        }
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      alert("Izin kamera ditolak. Pastikan izin kamera diberikan.");
      closeCameraModal();
    }
  };

  const toggleCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    startCamera(newMode);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.warn("GPS tidak aktif."),
        { enableHighAccuracy: true }
      );
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        // Use full sensor dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        context.save();
        if (facingMode === 'user') {
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
        }
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        context.restore();
        
        setPhoto(canvas.toDataURL('image/jpeg', 0.9));
        stopCamera();
      }
    }
  };

  const handleFinalSubmit = () => {
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      name: selectedName,
      timestamp: new Date().toLocaleString('id-ID'),
      photo: photo || '',
      location: { lat: location?.lat || 0, lng: location?.lng || 0 },
      type: attendanceType
    });
    setIsCameraOpen(false);
    setPhoto(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-[var(--g-surface)] p-6 md:p-8 rounded-[var(--g-radius)] border border-[var(--g-border)] shadow-[var(--g-shadow)]">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-[var(--g-primary-container)] rounded-xl flex items-center justify-center text-[var(--g-on-primary-container)] border border-[var(--g-primary)]/10 shadow-sm">
            <i className="fas fa-fingerprint text-lg"></i>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--g-on-surface)] leading-tight">Presensi Digital</h2>
            <p className="text-[9px] text-[var(--g-on-surface-variant)] font-black uppercase tracking-widest mt-0.5">Sistem Monitoring Duta 2026</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-[var(--g-on-surface-variant)] uppercase tracking-widest ml-1">Nama Personil</label>
            <select 
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              className="google-input w-full p-4 h-[52px] font-bold text-sm"
            >
              {ASSIGNEES.map(name => <option key={name} value={name}>{name.split(' (')[0]}</option>)}
            </select>
          </div>

          <div className="flex bg-[var(--g-bg)] p-1 rounded-xl border border-[var(--g-border)]">
            <button 
              onClick={() => setAttendanceType('In')}
              className={`flex-1 py-3 text-[9px] font-black transition-all rounded-lg tracking-widest uppercase ${attendanceType === 'In' ? 'bg-[var(--g-surface)] text-green-600 shadow-md border border-[var(--g-border)]' : 'text-[var(--g-on-surface-variant)] hover:text-[var(--g-on-surface)]'}`}
            >
              MASUK
            </button>
            <button 
              onClick={() => setAttendanceType('Out')}
              className={`flex-1 py-3 text-[9px] font-black transition-all rounded-lg tracking-widest uppercase ${attendanceType === 'Out' ? 'bg-[var(--g-surface)] text-red-600 shadow-md border border-[var(--g-border)]' : 'text-[var(--g-on-surface-variant)] hover:text-[var(--g-on-surface)]'}`}
            >
              PULANG
            </button>
          </div>

          <button 
            onClick={openCameraModal}
            className="w-full py-6 bg-[var(--g-primary)] text-black font-black shadow-xl rounded-xl tracking-[0.2em] text-xs uppercase hover:brightness-110 active:scale-95 transition-all border border-white/10"
          >
            AKTIFKAN KAMERA ABSENSI
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[9px] font-black text-[var(--g-on-surface-variant)] uppercase tracking-[0.3em] pl-1">Riwayat Log Hari Ini</h3>
        <div className="space-y-2">
          {logs.length === 0 ? (
            <div className="p-10 text-center border-2 border-dashed border-[var(--g-border)] rounded-[var(--g-radius)]">
               <p className="text-[var(--g-on-surface-variant)] text-[9px] uppercase font-black tracking-widest opacity-60 italic">No activity today</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="bg-[var(--g-surface)] p-4 rounded-xl border border-[var(--g-border)] flex items-center justify-between group hover:border-[var(--g-primary)]/30 transition-all shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[9px] font-black ${log.type === 'In' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'} border border-current/10`}>
                    {log.type.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--g-on-surface)] leading-none mb-1.5">{log.name.split(' (')[0]}</p>
                    <p className="text-[9px] text-[var(--g-on-surface-variant)] font-black uppercase tracking-widest">{log.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-[var(--g-bg)] flex items-center justify-center text-[var(--g-on-surface-variant)] group-hover:bg-[var(--g-primary)] group-hover:text-black transition-all border border-[var(--g-border)] text-xs">
                      <i className="fas fa-location-dot"></i>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isCameraOpen && (
        <div className="fixed inset-0 z-[2000] flex flex-col bg-black overflow-hidden">
          {/* Transparent Header */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center justify-between px-6 pointer-events-none">
            <div className="pointer-events-auto">
              <h3 className="font-extrabold text-white text-base tracking-tight drop-shadow-md">{selectedName.split(' (')[0]}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--g-primary)] drop-shadow-md">
                  {attendanceType === 'In' ? 'LOGGING: ENTRY' : 'LOGGING: EXIT'}
                </p>
              </div>
            </div>
            <button onClick={closeCameraModal} className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl text-white flex items-center justify-center hover:bg-white/20 transition-all pointer-events-auto border border-white/5">
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          <div className="flex-1 relative bg-black flex items-center justify-center">
            {!photo ? (
              <>
                {/* TRUE FULL SCREEN VIDEO - NO CLIPPING */}
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className={`absolute inset-0 w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} 
                />
                
                {/* Floating Location Pill */}
                <div className="absolute bottom-36 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center gap-3 shadow-2xl transition-all">
                   <div className={`w-2 h-2 rounded-full ${location ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.9)]' : 'bg-red-500 animate-pulse'}`}></div>
                   <span className="text-[9px] text-white font-black tracking-[0.2em] uppercase">
                    {location ? 'LOKASI TERVERIFIKASI' : 'MENCARI SINYAL GPS...'}
                   </span>
                </div>

                {/* Controls Area */}
                <div className="absolute bottom-10 inset-x-0 flex items-center justify-around px-8">
                  <button onClick={toggleCamera} className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl text-white flex items-center justify-center hover:bg-white/20 transition-all border border-white/10 shadow-lg">
                    <i className="fas fa-sync-alt text-xl"></i>
                  </button>
                  
                  <button 
                    onClick={takePhoto} 
                    disabled={!location} 
                    className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full p-2 shadow-2xl disabled:opacity-30 transition-all active:scale-90 group"
                  >
                    <div className="w-full h-full border-4 border-white rounded-full bg-transparent flex items-center justify-center group-active:bg-white transition-all">
                      <div className="w-16 h-16 rounded-full bg-white opacity-40 group-hover:opacity-100 transition-all"></div>
                    </div>
                  </button>

                  <div className="w-16 h-16"></div> {/* Spacer for symmetry */}
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#0a0a0a]">
                <img src={photo} className="w-full h-full max-h-[75vh] object-contain rounded-3xl shadow-2xl border border-white/5 mb-10" />
                <div className="flex gap-4 w-full max-w-sm">
                   <button onClick={() => { setPhoto(null); startCamera(facingMode); }} className="flex-1 py-5 bg-white/5 text-white font-extrabold rounded-2xl tracking-[0.2em] text-[10px] uppercase border border-white/10 hover:bg-white/10 transition-all">ULANGI FOTO</button>
                   <button onClick={handleFinalSubmit} className="flex-1 py-5 bg-[var(--g-primary)] text-black font-extrabold rounded-2xl shadow-2xl tracking-[0.2em] text-[10px] uppercase hover:brightness-110 active:scale-95 transition-all">VERIFIKASI</button>
                </div>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
};

export default AttendanceModule;
