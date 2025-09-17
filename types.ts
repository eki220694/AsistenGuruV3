export enum View {
  Dashboard = 'Dasbor',
  Planner = 'Perencana Pelajaran',
  Students = 'Keterlibatan Siswa',
  Assessments = 'Penilaian',
  Class = 'Manajemen Kelas',
  TestRunner = 'Penguji Otomatis',
}

export enum Attendance {
  Present = 'Hadir',
  Sick = 'Sakit',
  Permission = 'Izin',
  Alpha = 'Alpa',
  Skipping = 'Bolos',
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Subject {
    id: string;
    name: string;
}

export interface Classroom {
  id: string;
  name: string;
  subject: Subject;
  studentIds: number[];
}

export interface Student {
  id: number;
  name: string;
  avatar: string;
  attendance: Attendance;
  participation: number;
  grades: { [quizId: string]: number };
}

export interface LessonPlan {
  id: string;
  classroomId: string;
  title: string;
  date: string;
  topic: string;
  objectives: string[];
  materials: string[];
  activities: string[];
  assessment: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  id: string;
  classroomId: string;
  title: string;
  topic: string;
  questions: QuizQuestion[];
}

export interface Announcement {
  id: string;
  classroomId: string;
  title: string;
  content: string;
  date: string;
}