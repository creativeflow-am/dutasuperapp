
import { ContentStatus, WorkflowStep, ContentItem, MeetingMinute, WeeklyReport, SocialMetric, AmbassadorProfile, ScheduleAssignment } from './types';

export const ASSIGNEES = [
  "M. Rizki Fadhlilah (Duta Utama Putra)",
  "Mitsni Uswatun Hasanah (Duta Utama Putri)",
  "Rasikin (Duta Wakil 1 Putra)",
  "Sahla Aina Muflihah (Duta Wakil 1 Putri)",
  "Yudi Prasetya (Duta Photogenic Putra)",
  "Berliana Nabila Az-zahra (Duta Photogenic Putri)",
  "M. Irfan Maulana (Duta Intelegensia Putra)",
  "Nadia Salma (Duta Intelegensia Putri)",
  "Agus Haerul (Duta Favorit Putra)",
  "Amelia Agustina (Duta Favorit Putri)",
  "Dhiya Ghisya Aulia",
  "Muhamad Syihabudin Anam",
  "Moja Yulia Paramita",
  "Syahdan Noer Saputra",
  "Khoridatus Shofa",
  "Mardiya Ghorizadin",
  "Tonisah",
  "M. Ade Rifki",
  "M. Ade Rifki (Senior)",
  "M. Danu Ar-Rahman",
  "Zahra Roudhotun Najah"
];

export const AMBASSADOR_PROFILES: AmbassadorProfile[] = [
  { name: 'M. Rizki Fadhlilah', birthDate: '03/01/2006', nim: '2381030039', whatsapp: '6282120117319', email: 'rizkipro602@gmail.com', semester: '6', faculty: 'FITK', major: 'Tadris Bahasa Inggris' },
  { name: 'Mitsni Uswatun Hasanah', birthDate: '08/09/2005', nim: '2381030111', whatsapp: '6285720886479', email: 'mitsniuswatun@gmail.com', semester: '6', faculty: 'FITK', major: 'Tadris Bahasa Inggris' },
  { name: 'Rasikin', birthDate: '14/10/2003', nim: '2383130044', whatsapp: '6283847156534', email: 'rasikinikin577@gmail.com', semester: '6', faculty: 'Fasya', major: 'Hukum Tatanegara' },
  { name: 'Sahla Aina Muflihah', birthDate: '19/07/2005', nim: '2381030135', whatsapp: '6281937312741', email: 'sahlaainam@gmail.com', semester: '6', faculty: 'FITK', major: 'Tadris Bahasa Inggris' },
  { name: 'Yudi Prasetya', birthDate: '23/09/2004', nim: '2482110053', whatsapp: '6285797867218', email: 'pyudi9203@gmail.com', semester: '4', faculty: 'FEBI', major: 'Perbankan Syariah' },
  { name: 'Berliana Nabila Az-zahra', birthDate: '03/08/2006', nim: '2484110119', whatsapp: '6283128251528', email: 'nabilaberliana822@gmail.com', semester: '4', faculty: 'FDKI', major: 'Komunikasi dan Penyiaran Islam' },
  { name: 'M. Irfan Maulana', birthDate: '26/03/2005', nim: '2384120017', whatsapp: '6289526735226', email: 'irfan.maulana032005@gmail.com', semester: '6', faculty: 'FDKI', major: 'Pengembangan Masyarakat Islam' },
  { name: 'Nadia Salma', birthDate: '17/11/2004', nim: '2384110096', whatsapp: '6285872364786', email: 'nadiasalma7111@gmail.com', semester: '6', faculty: 'FDKI', major: 'Komunikasi dan Penyiaran Islam' },
  { name: 'Agus Haerul', birthDate: '01/08/2006', nim: '2484110118', whatsapp: '6283824471817', email: 'agshrl01@gmail.com', semester: '4', faculty: 'FDKI', major: 'Komunikasi dan Penyiaran Islam' },
  { name: 'Amelia Agustina', birthDate: '31/07/2005', nim: '2384110084', whatsapp: '6283824728331', email: 'agustinaamelia087@gmail.com', semester: '6', faculty: 'FDKI', major: 'Komunikasi dan Penyiaran Islam' },
  { name: 'Dhiya Ghisya Aulia', birthDate: '03/08/2005', nim: '2384130124', whatsapp: '6282310951884', email: 'dhy.hons03@gmail.com', semester: '6', faculty: 'FDKI', major: 'Bimbingan dan Konseling Islam' },
  { name: 'Muhamad Syihabudin Anam', birthDate: '09/07/2005', nim: '2382130031', whatsapp: '6282129620584', email: 'Sy3hab@gmail.com', semester: '6', faculty: 'FEBI', major: 'Akuntansi Syariah' },
  { name: 'Moja Yulia Paramita', birthDate: '21/07/2004', nim: '2385160037', whatsapp: '6281316493596', email: 'mozaparamita73596@gmail.com', semester: '6', faculty: 'FUA', major: 'Tasawuf dan Psikoterapi' },
  { name: 'Syahdan Noer Saputra', birthDate: '01/02/2005', nim: '2383130008', whatsapp: '6285697168047', email: 'noerptra@gmail.com', semester: '6', faculty: 'Fasya', major: 'Hukum Tatanegara' },
  { name: 'Khoridatus Shofa', birthDate: '24/03/2006', nim: '2485110009', whatsapp: '6282130028893', email: 'khoridatusshofakip@gmail.com', semester: '4', faculty: 'FUA', major: 'Sejarah Peradaban Islam' },
  { name: 'Mardiya Ghorizadin', birthDate: '24/07/2006', nim: '2485110023', whatsapp: '6285215440520', email: 'mghorizadin@gmail.com', semester: '4', faculty: 'FUA', major: 'Sejarah Peradaban Islam' },
  { name: 'Tonisah', birthDate: '22/12/2004', nim: '2381050044', whatsapp: '6282127677687', email: 'tonisahaha@gmail.com', semester: '6', faculty: 'FITK', major: 'Tadris Matematika' },
  { name: 'M. Ade Rifki', birthDate: '15/03/2005', nim: '2381030032', whatsapp: '6283109707513', email: 'aderifki882@gmail.com', semester: '6', faculty: 'FITK', major: 'Tadris Bahasa Inggris' },
  { name: 'M. Danu Ar-Rahman', birthDate: '-', nim: '-', whatsapp: '', email: '', semester: '-', faculty: '-', major: '-' },
  { name: 'Zahra Roudhotun Najah', birthDate: '-', nim: '-', whatsapp: '', email: '', semester: '-', faculty: '-', major: '-' },
];

export const WORKFLOW: WorkflowStep[] = [
  { status: ContentStatus.IDEATION, label: '💡 Ideasi', description: 'Brainstorming ide & konsep awal.', color: 'bg-blue-100 text-blue-700' },
  { status: ContentStatus.DRAFTING, label: '📝 Scripting', description: 'Penulisan caption & draft visual.', color: 'bg-purple-100 text-purple-700' },
  { status: ContentStatus.IN_PROGRESS, label: '🎬 Produksi', description: 'Proses editing/shooting aset.', color: 'bg-yellow-100 text-yellow-700' },
  { status: ContentStatus.REVISION, label: '🔄 Revisi', description: 'Perbaikan berdasarkan feedback.', color: 'bg-red-100 text-red-700' },
  { status: ContentStatus.APPROVED, label: '✅ Approved', description: 'Konten siap dijadwalkan.', color: 'bg-emerald-100 text-emerald-700' },
  { status: ContentStatus.SCHEDULED, label: '📅 Terjadwal', description: 'Sudah masuk ke scheduler.', color: 'bg-cyan-100 text-cyan-700' },
  { status: ContentStatus.PUBLISHED, label: '🚀 Published', description: 'Konten sudah live.', color: 'bg-slate-100 text-slate-700' },
];

export const MOCK_SOCIAL_METRICS: SocialMetric[] = [
  { id: 'sm-1', month: 'Jan', likes: 1200, comments: 150, views: 15000, shares: 80 },
  { id: 'sm-2', month: 'Feb', likes: 1800, comments: 220, views: 22000, shares: 120 },
  { id: 'sm-3', month: 'Mar', likes: 1500, comments: 180, views: 19000, shares: 95 },
  { id: 'sm-4', month: 'Apr', likes: 2100, comments: 310, views: 28000, shares: 200 },
  { id: 'sm-5', month: 'Mei', likes: 3200, comments: 450, views: 45000, shares: 350 },
  { id: 'sm-6', month: 'Jun', likes: 2800, comments: 390, views: 38000, shares: 210 },
  { id: 'sm-7', month: 'Jul', likes: 3500, comments: 510, views: 52000, shares: 420 },
  { id: 'sm-8', month: 'Agu', likes: 4100, comments: 620, views: 65000, shares: 580 },
  { id: 'sm-9', month: 'Sep', likes: 3900, comments: 580, views: 61000, shares: 490 },
  { id: 'sm-10', month: 'Okt', likes: 4500, comments: 710, views: 72000, shares: 630 },
  { id: 'sm-11', month: 'Nov', likes: 4800, comments: 820, views: 85000, shares: 710 },
  { id: 'sm-12', month: 'Des', likes: 5200, comments: 950, views: 98000, shares: 850 },
];

export const MOCK_DATA: ContentItem[] = [
  {
    id: '1',
    postDate: '2026-05-20',
    deadline: '2026-05-18',
    platform: 'Instagram',
    title: 'Cara Daftar PMB UIN Siber 2026',
    caption: 'Halo Sobat Siber! Masih bingung cara daftar? Cek video ini ya! #UINSiber #Cirebon',
    driveLink: 'https://drive.google.com/drive/folders/1',
    thumbnailLink: 'https://picsum.photos/seed/uinsiber/400/225',
    status: ContentStatus.PUBLISHED,
    assignee: ASSIGNEES[0],
    notes: 'Pastikan logo UIN Siber terlihat jelas.'
  }
];

export const MOCK_MINUTES: MeetingMinute[] = [
  {
    id: 'm1',
    date: '2026-05-15',
    title: 'Evaluasi Mingguan Duta Kampus',
    summary: 'Meningkatkan intensitas kunjungan ke sekolah-sekolah di wilayah Ciayumajakuning.',
    fileLink: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    author: "Admin Admisi"
  }
];

export const MOCK_REPORTS: WeeklyReport[] = [
  {
    id: 'rep-1',
    activityTitle: 'Sosialisasi di MAN 1 Cirebon',
    category: 'Sosialisasi',
    description: 'Melakukan presentasi program studi dan jalur beasiswa di hadapan 200 siswa kelas XII.',
    proofUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    ambassadorName: ASSIGNEES[0],
    date: '2026-05-18',
    location: 'Kab. Cirebon',
    status: 'Tervalidasi'
  },
  {
    id: 'rep-2',
    activityTitle: 'Pelayanan Helpdesk PMB',
    category: 'Pelayanan Admisi',
    description: 'Membantu calon mahasiswa baru dalam proses input data di sistem pendaftaran online.',
    proofUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    ambassadorName: ASSIGNEES[1],
    date: '2026-05-19',
    location: 'Gedung Rektorat Lt. 1',
    status: 'Proses Cek'
  }
];

export const MOCK_SCHEDULES: ScheduleAssignment[] = [
  {
    id: 's1',
    ambassadorNames: [ASSIGNEES[0], ASSIGNEES[1]],
    taskTitle: 'Sosialisasi SMAN 1 Kuningan',
    description: 'Presentasi dan penyebaran brosur PMB 2026.',
    date: '2026-06-01',
    category: 'Sosialisasi',
    priority: 'High',
    location: 'SMAN 1 Kuningan, Jawa Barat'
  },
  {
    id: 's2',
    ambassadorNames: [ASSIGNEES[4]],
    taskTitle: 'Content Creator Hunt',
    description: 'Pembuatan konten testimoni mahasiswa berprestasi.',
    date: '2026-01-05',
    category: 'Produksi Konten',
    priority: 'Medium',
    location: 'Studio Multimedia Lt. 3'
  }
];