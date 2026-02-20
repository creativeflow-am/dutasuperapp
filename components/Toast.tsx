
import React, { useEffect } from 'react';
import { Notification } from '../types';

interface ToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(notification.id), 3000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  const bgColor = {
    success: 'bg-[#34C759]',
    info: 'bg-[#007AFF]',
    warning: 'bg-[#FF9500]'
  }[notification.type];

  const icon = {
    success: 'fa-check-circle',
    info: 'fa-info-circle',
    warning: 'fa-exclamation-triangle'
  }[notification.type];

  return (
    <div className={`${bgColor} text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right duration-300 pointer-events-auto border border-white/10 native-transition`}>
      <i className={`fas ${icon} text-[15px]`}></i>
      <span className="text-[13px] font-bold tracking-tight uppercase">{notification.message}</span>
      <button onClick={() => onClose(notification.id)} className="opacity-60 ml-1 native-transition">
        <i className="fas fa-times text-[13px]"></i>
      </button>
    </div>
  );
};

export default Toast;