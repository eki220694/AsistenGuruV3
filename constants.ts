import type { Teacher, Subject, Classroom, Student, LessonPlan, Quiz, Announcement } from './types';
import { Attendance } from './types';

export const MOCK_TEACHER: Teacher = {
  id: 't1',
  name: 'Dr. Evelyn Sari',
  email: 'e.sari@school.edu',
  avatar: 'https://picsum.photos/seed/teacher/100',
};

export const MOCK_SUBJECTS: Subject[] = [
    { id: 'subj-bio', name: 'Biologi' },
    { id: 'subj-hist', name: 'Sejarah' },
];

export const MOCK_STUDENTS: Student[] = [
  { id: 1, name: 'Alice Wijaya', avatar: 'https://picsum.photos/seed/alice/100', attendance: Attendance.Present, participation: 3, grades: { 'q1-bio': 85, 'q2-hist': 92 } },
  { id: 2, name: 'Budi Santoso', avatar: 'https://picsum.photos/seed/bob/100', attendance: Attendance.Present, participation: 5, grades: { 'q1-bio': 90, 'q2-hist': 88 } },
  { id: 3, name: 'Charlie Kurniawan', avatar: 'https://picsum.photos/seed/charlie/100', attendance: Attendance.Alpha, participation: 1, grades: { 'q1-bio': 72, 'q2-hist': 75 } },
  { id: 4, name: 'Diana Lestari', avatar: 'https://picsum.photos/seed/diana/100', attendance: Attendance.Present, participation: 4, grades: { 'q1-bio': 95, 'q2-hist': 98 } },
  { id: 5, name: 'Ethan Nugroho', avatar: 'https://picsum.photos/seed/ethan/100', attendance: Attendance.Sick, participation: 2, grades: { 'q1-bio': 68, 'q2-hist': 80 } },
  { id: 6, name: 'Fiona Garcia', avatar: 'https://picsum.photos/seed/fiona/100', attendance: Attendance.Permission, participation: 5, grades: { 'q1-bio': 88, 'q2-hist': 91 } },
  { id: 7, name: 'George Siregar', avatar: 'https://picsum.photos/seed/george/100', attendance: Attendance.Present, participation: 4, grades: { 'q1-bio': 78, 'q2-hist': 85 } },
  { id: 8, name: 'Helen Susanto', avatar: 'https://picsum.photos/seed/helen/100', attendance: Attendance.Skipping, participation: 3, grades: { 'q1-bio': 82, 'q2-hist': 89 } },
];

export const MOCK_CLASSROOMS: Classroom[] = [
  { id: 'c1', name: 'Periode 1 - Biologi', subject: MOCK_SUBJECTS[0], studentIds: [1, 2, 3, 4] },
  { id: 'c2', name: 'Periode 3 - Sejarah', subject: MOCK_SUBJECTS[1], studentIds: [5, 6, 7, 8] },
  { id: 'c3', name: 'Periode 5 - Biologi', subject: MOCK_SUBJECTS[0], studentIds: [5, 6, 1, 8] },
];

export const MOCK_LESSON_PLANS: LessonPlan[] = [
  {
    id: 'lp1',
    classroomId: 'c1',
    title: 'Pengantar Fotosintesis',
    date: '2024-10-26',
    topic: 'Biologi',
    objectives: ['Mendefinisikan fotosintesis', 'Mengidentifikasi reaktan dan produk'],
    materials: ['Buku teks', 'Papan tulis', 'Diagram daun tanaman'],
    activities: ['Ceramah', 'Diskusi kelompok', 'Lembar kerja pelabelan'],
    assessment: 'Kuis singkat tentang istilah-istilah kunci.',
  },
  {
    id: 'lp2',
    classroomId: 'c2',
    title: 'Revolusi Amerika: Pertempuran Kunci',
    date: '2024-10-27',
    topic: 'Sejarah',
    objectives: ['Menjelaskan signifikansi 3 pertempuran kunci', 'Menganalisis strategi yang digunakan'],
    materials: ['Peta historis', 'Dokumen sumber primer', 'Slide presentasi'],
    activities: ['Analisis peta', 'Membaca dokumen', 'Berpikir-berpasangan-berbagi'],
    assessment: 'Tiket keluar meminta untuk memberi peringkat pentingnya pertempuran yang dibahas.',
  },
];

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: 'q1-bio',
    classroomId: 'c1',
    title: 'Dasar-dasar Fotosintesis',
    topic: 'Biologi',
    questions: [
      { question: 'Apa pigmen utama pada tumbuhan?', options: ['Klorofil', 'Melanin', 'Karoten', 'Xantofil'], correctAnswer: 'Klorofil' },
      { question: 'Gas manakah yang merupakan produk sampingan dari fotosintesis?', options: ['Karbon Dioksida', 'Oksigen', 'Nitrogen', 'Metana'], correctAnswer: 'Oksigen' },
    ]
  },
  {
    id: 'q2-hist',
    classroomId: 'c2',
    title: 'Fakta Revolusi Amerika',
    topic: 'Sejarah',
    questions: [
      { question: 'Pertempuran Saratoga merupakan titik balik karena...', options: ['Merupakan pertempuran pertama', 'Mengakhiri perang', 'Meyakinkan Prancis untuk bersekutu dengan AS', 'Merupakan kemenangan besar Inggris'], correctAnswer: 'Meyakinkan Prancis untuk bersekutu dengan AS' },
      { question: 'Di manakah tentara Inggris menyerah?', options: ['Gettysburg', 'Yorktown', 'Boston', 'Philadelphia'], correctAnswer: 'Yorktown' },
    ]
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
    { id: 'a1', classroomId: 'c1', title: 'Jadwal Ujian Tengah Semester', content: 'Untuk Biologi Periode 1: Harap dicatat bahwa ujian tengah semester dijadwalkan pada minggu terakhir bulan Oktober.', date: '2024-10-15' },
    { id: 'a2', classroomId: 'c2', title: 'Konferensi Orang Tua-Guru', content: 'Untuk Sejarah Periode 3: Pendaftaran untuk konferensi orang tua-guru sekarang dibuka.', date: '2024-10-12' },
];