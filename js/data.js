/**
 * DR. RAHMA MERSI PLATFORM — DATA STORE
 * All demo data and state management
 */

// ── Access Codes (in production: stored server-side, never in frontend)
const ACCESS_CODES = {
  'admin2025': { role: 'admin',   subject: 'إدارة المنصة',   limit: 1,   uses: 1 },
  'bio2025':   { role: 'student', subject: 'أحياء خلوية',    limit: 50,  uses: 23 },
  'gen2025':   { role: 'student', subject: 'علم الوراثة',    limit: 50,  uses: 31 },
  'chem2025':  { role: 'student', subject: 'كيمياء حيوية',   limit: 40,  uses: 18 },
  'phys2025':  { role: 'student', subject: 'فسيولوجيا النبات', limit: 35, uses: 14 },
  'anat2025':  { role: 'student', subject: 'أناتومي',        limit: 30,  uses: 9  },
};

// ── Videos Library
const VIDEOS = [
  {
    id: 1,
    title: 'خلية الحيوان — التركيب والوظيفة',
    subject: 'أحياء خلوية',
    duration: '41:08',
    views: 234,
    locked: false,
    isNew: true,
    tags: ['خلية حيوانية', 'عضيات', 'ميتوكوندريا', 'نواة'],
    desc: 'شرح مفصل لتركيب الخلية الحيوانية ووظائف عضياتها المختلفة من النواة إلى الميتوكوندريا والجسيمات الحالّة.',
    thumb_color: '#1a4480'
  },
  {
    id: 2,
    title: 'التمثيل الضوئي — المراحل والتفاعلات',
    subject: 'فسيولوجيا النبات',
    duration: '38:45',
    views: 198,
    locked: false,
    isNew: true,
    tags: ['تمثيل ضوئي', 'كلوروبلاست', 'طاقة'],
    desc: 'شرح مراحل التمثيل الضوئي ومعادلاته الكيميائية وعلاقته بالطاقة الضوئية والكيميائية.',
    thumb_color: '#166534'
  },
  {
    id: 3,
    title: 'الوراثة — قوانين مندل الثلاثة',
    subject: 'علم الوراثة',
    duration: '52:20',
    views: 312,
    locked: false,
    isNew: false,
    tags: ['وراثة', 'مندل', 'جينات', 'طفرة'],
    desc: 'شرح قوانين مندل مع أمثلة تطبيقية وحل مسائل الوراثة العددية والرسوم البيانية.',
    thumb_color: '#3730a3'
  },
  {
    id: 4,
    title: 'الإنزيمات — الخصائص والتطبيقات',
    subject: 'كيمياء حيوية',
    duration: '35:10',
    views: 156,
    locked: false,
    isNew: false,
    tags: ['إنزيمات', 'كيمياء حيوية', 'تحفيز حيوي'],
    desc: 'دراسة الإنزيمات وآلية عملها وعوامل تأثير النشاط الإنزيمي والتطبيقات الطبية.',
    thumb_color: '#92400e'
  },
  {
    id: 5,
    title: 'الجهاز العصبي — التركيب والوظيفة',
    subject: 'أناتومي',
    duration: '44:55',
    views: 0,
    locked: true,
    isNew: true,
    tags: ['جهاز عصبي', 'نيورون', 'دماغ'],
    desc: 'محاضرة متقدمة عن الجهاز العصبي المركزي والطرفي وآليات النقل العصبي.',
    thumb_color: '#7c2d12'
  },
  {
    id: 6,
    title: 'الطحالب والفطريات — التصنيف',
    subject: 'تصنيف الكائنات',
    duration: '29:30',
    views: 0,
    locked: true,
    isNew: false,
    tags: ['طحالب', 'فطريات', 'تصنيف'],
    desc: 'تصنيف الطحالب والفطريات وأهميتها البيئية والتطبيقات البيوتكنولوجية.',
    thumb_color: '#065f46'
  },
  {
    id: 7,
    title: 'الانقسام الميتوزي والميوزي',
    subject: 'أحياء خلوية',
    duration: '47:22',
    views: 289,
    locked: false,
    isNew: false,
    tags: ['ميتوزي', 'ميوزي', 'انقسام خلوي'],
    desc: 'مقارنة شاملة بين الانقسام الميتوزي والميوزي ومراحل كل منهما وأهميتهما البيولوجية.',
    thumb_color: '#1a4480'
  },
  {
    id: 8,
    title: 'الحوامض النووية — DNA و RNA',
    subject: 'كيمياء حيوية',
    duration: '55:00',
    views: 401,
    locked: false,
    isNew: true,
    tags: ['DNA', 'RNA', 'تكرار', 'ترجمة'],
    desc: 'بنية الحوامض النووية وآليات التكرار والنسخ والترجمة بالتفصيل العلمي الكامل.',
    thumb_color: '#92400e'
  },
];

// ── Subjects
const SUBJECTS = [
  { id: 1, name: 'أحياء خلوية',      icon: '🔬', count: 6,  color: '#1a4480', code: 'bio2025'  },
  { id: 2, name: 'علم الوراثة',       icon: '🧬', count: 5,  color: '#3730a3', code: 'gen2025'  },
  { id: 3, name: 'فسيولوجيا النبات', icon: '🌱', count: 4,  color: '#166534', code: 'phys2025' },
  { id: 4, name: 'كيمياء حيوية',      icon: '⚗️', count: 5,  color: '#92400e', code: 'chem2025' },
  { id: 5, name: 'أناتومي',           icon: '🫀', count: 3,  color: '#7c2d12', code: 'anat2025' },
  { id: 6, name: 'تصنيف الكائنات',   icon: '🦠', count: 4,  color: '#065f46', code: 'bio2025'  },
];

// ── Demo Students (Admin view only)
const STUDENTS = [
  { name: 'أحمد محمد علي',    subject: 'أحياء خلوية',     last: 'اليوم 9:30 ص',  views: 12, active: true  },
  { name: 'نور إبراهيم',      subject: 'علم الوراثة',      last: 'أمس 4:15 م',    views: 8,  active: true  },
  { name: 'محمد خالد',        subject: 'كيمياء حيوية',     last: 'أمس 11:00 ص',   views: 15, active: true  },
  { name: 'سارة الأنصاري',   subject: 'فسيولوجيا النبات', last: 'منذ 3 أيام',   views: 4,  active: false },
  { name: 'يوسف تامر',        subject: 'أناتومي',           last: 'منذ أسبوع',    views: 2,  active: false },
  { name: 'منى حسن',          subject: 'أحياء خلوية',     last: 'اليوم 11:00 ص', views: 19, active: true  },
];

// ── App State
const STATE = {
  user: null,
  currentVideoId: null,
  playing: false,
  progress: 0,
  volume: 80,
  muted: false,
  filterSubject: 'all',
  searchQuery: '',
  progressInterval: null,
  codes: { ...ACCESS_CODES }
};
