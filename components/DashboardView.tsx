
import React from 'react';
import Card from './common/Card';
import type { LessonPlan, Student, Classroom, Quiz } from '../types';
import { Attendance, View } from '../types';

interface DashboardViewProps {
  classroom: Classroom | null;
  lessons: LessonPlan[];
  quizzes: Quiz[];
  students: Student[];
  setActiveView: (view: View) => void;
}

const DonutChart: React.FC<{ percentage: number; color: string }> = ({ percentage, color }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          className="text-gray-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <span className="absolute text-2xl font-bold text-text-main top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {percentage.toFixed(0)}%
      </span>
    </div>
  );
};


const DashboardView: React.FC<DashboardViewProps> = ({ classroom, lessons, quizzes, students, setActiveView }) => {

  if (!classroom) {
    return (
        <div className="p-4 md:p-8 flex items-center justify-center h-full">
            <Card>
                <h1 className="text-2xl font-bold text-text-main">Selamat Datang di Dasbor Anda</h1>
                <p className="text-text-secondary mt-2">Silakan mulai dengan memilih atau membuat kelas.</p>
            </Card>
        </div>
    );
  }

  const attendanceCounts = {
    [Attendance.Present]: students.filter(s => s.attendance === Attendance.Present).length,
    [Attendance.Sick]: students.filter(s => s.attendance === Attendance.Sick).length,
    [Attendance.Permission]: students.filter(s => s.attendance === Attendance.Permission).length,
    [Attendance.Alpha]: students.filter(s => s.attendance === Attendance.Alpha).length,
    [Attendance.Skipping]: students.filter(s => s.attendance === Attendance.Skipping).length,
  };
  const totalStudents = students.length;
  const presentPercentage = totalStudents > 0 ? (attendanceCounts[Attendance.Present] / totalStudents) * 100 : 0;
  
  const latestQuiz = quizzes.length > 0 ? quizzes[quizzes.length - 1] : null;
  const latestQuizAverage = latestQuiz && totalStudents > 0
    ? students.reduce((acc, student) => acc + (student.grades[latestQuiz.id] || 0), 0) / totalStudents
    : 0;


  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-2">Dasbor</h1>
      <h2 className="text-xl md:text-2xl font-semibold text-primary mb-8">{classroom.name} - {classroom.subject.name}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <Card title="Tinjauan Kelas" onClick={() => setActiveView(View.Students)}>
            <div className="flex flex-col sm:flex-row items-center justify-around text-center gap-4">
                <DonutChart percentage={presentPercentage} color="text-secondary" />
                <div className="space-y-2">
                    <p className="text-4xl font-bold">{totalStudents}</p>
                    <p className="text-text-secondary">Total Siswa</p>
                    <div className="text-left text-sm grid grid-cols-2 gap-x-4">
                        <p><span className="text-green-500 font-semibold">●</span> {attendanceCounts.Hadir} Hadir</p>
                        <p><span className="text-blue-500 font-semibold">●</span> {attendanceCounts.Sakit} Sakit</p>
                        <p><span className="text-purple-500 font-semibold">●</span> {attendanceCounts.Izin} Izin</p>
                        <p><span className="text-orange-500 font-semibold">●</span> {attendanceCounts.Alpa} Alpa</p>
                        <p><span className="text-red-500 font-semibold">●</span> {attendanceCounts.Bolos} Bolos</p>
                    </div>
                </div>
            </div>
        </Card>

        <Card title="Pelajaran Mendatang" onClick={() => setActiveView(View.Planner)}>
            {lessons.length > 0 ? lessons.slice(0, 3).map(lesson => (
                <div key={lesson.id} className="py-2 border-b last:border-b-0">
                    <p className="font-semibold text-text-main">{lesson.title}</p>
                    <p className="text-sm text-text-secondary">{lesson.date}</p>
                </div>
            )) : <p className="text-text-secondary">Belum ada pelajaran mendatang.</p>}
             <p className="text-primary font-semibold mt-4 hover:underline">Lihat Semua Pelajaran →</p>
        </Card>
        
        <Card title="Snapshot Penilaian" onClick={() => setActiveView(View.Assessments)}>
            {latestQuiz ? (
                <div>
                    <p className="text-text-secondary text-sm">Kuis Terbaru:</p>
                    <p className="font-bold text-lg text-text-main mb-2">{latestQuiz.title}</p>
                    <p className="text-text-secondary text-sm">Rata-rata Kelas</p>
                    <p className="text-4xl font-bold text-primary">{latestQuizAverage.toFixed(1)}%</p>
                </div>
            ) : (
                <p className="text-text-secondary">Belum ada penilaian yang dicatat.</p>
            )}
             <p className="text-primary font-semibold mt-4 hover:underline">Lihat Semua Penilaian →</p>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;