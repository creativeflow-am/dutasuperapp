
export enum ContentStatus {
  IDEATION = 'Ideation',
  DRAFTING = 'Drafting',
  IN_PROGRESS = 'In Progress',
  REVISION = 'Revision',
  APPROVED = 'Approved',
  SCHEDULED = 'Scheduled',
  PUBLISHED = 'Published'
}

export type ReportStatus = 'Proses Cek' | 'Tidak Diterima' | 'Tervalidasi';

export type Platform = 'Instagram' | 'TikTok' | 'YouTube' | 'LinkedIn' | 'Twitter';
export type ViewMode = 'Dashboard' | 'Content' | 'Notulensi' | 'Absensi' | 'Evidence' | 'Performance' | 'Jadwal' | 'Members';
export type ActivityCategory = 'Sosialisasi' | 'Pelayanan Admisi' | 'Produksi Konten' | 'Event Kampus' | 'Lainnya';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export interface ContentItem {
  id: string;
  postDate: string;
  deadline?: string;
  platform: Platform;
  title: string;
  caption: string;
  driveLink: string;
  thumbnailLink: string;
  status: ContentStatus;
  assignee: string;
  notes: string;
}

export interface MeetingMinute {
  id: string;
  date: string;
  title: string;
  summary: string;
  fileLink: string; // Will store Base64 or URL
  author: string;
}

export interface AttendanceRecord {
  id: string;
  name: string;
  timestamp: string;
  photo: string; // Base64 string
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  type: 'In' | 'Out';
}

export interface WeeklyReport {
  id: string;
  activityTitle: string;
  category: ActivityCategory;
  description: string;
  proofUrl: string;
  pdfUrl?: string; // Will store Base64 or URL
  ambassadorName: string;
  date: string;
  location?: string;
  status: ReportStatus;
}

export interface SocialMetric {
  // Added id for data management and to resolve type errors in App.tsx
  id: string;
  month: string;
  likes: number;
  comments: number;
  views: number;
  shares: number;
}

export interface ScheduleAssignment {
  id: string;
  ambassadorNames: string[];
  taskTitle: string;
  description: string;
  date: string;
  category: ActivityCategory;
  priority: 'Low' | 'Medium' | 'High';
  location: string;
}

export interface AmbassadorProfile {
  name: string;
  birthDate: string;
  nim: string;
  whatsapp: string;
  email: string;
  semester: string;
  faculty: string;
  major: string;
}

export interface WorkflowStep {
  status: ContentStatus;
  label: string;
  description: string;
  color: string;
}