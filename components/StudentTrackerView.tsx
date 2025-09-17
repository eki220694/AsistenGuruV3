import React from 'react';
import type { Student, Classroom } from '../types';
import { Attendance } from '../types';
import Card from './common/Card';

interface StudentTrackerViewProps {
  students: Student[];
  classroom: Classroom | null;
  onAttendanceChange: (studentId: number, newAttendance: Attendance) => void;
  onParticipationChange: (studentId: number, change: number) => void;
}

const StudentTrackerView: React.FC<StudentTrackerViewProps> = ({ students, classroom, onAttendanceChange, onParticipationChange }) => {
  
  const getAttendanceColor = (attendance: Attendance) => {
      switch(attendance) {
          case Attendance.Present: return 'bg-green-100 text-green-800';
          case Attendance.Sick: return 'bg-blue-100 text-blue-800';
          case Attendance.Permission: return 'bg-purple-100 text-purple-800';
          case Attendance.Alpha: return 'bg-orange-100 text-orange-800';
          case Attendance.Skipping: return 'bg-red-100 text-red-800';
          default: return 'bg-gray-100 text-gray-800';
      }
  }

  // Guard clause for when no class is selected.
  // This ensures the view reliably updates when the classroom context changes.
  if (!classroom) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-2">Pelacak Keterlibatan Siswa</h1>
        <Card>
           <div className="text-center text-text-secondary p-12">
                <h3 className="text-xl font-bold text-text-main mb-2">Tidak Ada Kelas yang Dipilih</h3>
                <p>Silakan pilih kelas dari bilah sisi untuk melihat siswanya.</p>
           </div>
        </Card>
      </div>
    );
  }

  // Main render logic when a class IS selected.
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-2">Pelacak Keterlibatan Siswa</h1>
      <h2 className="text-xl md:text-2xl font-semibold text-primary mb-8">{classroom.name} - {classroom.subject.name}</h2>
      
      {students.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {students.map(student => (
            <Card key={student.id} className="text-center">
              <img src={student.avatar} alt={student.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
              <h4 className="text-lg font-bold text-text-main">{student.name}</h4>
              
              <div className="mt-4">
                <label className="text-sm font-medium text-text-secondary">Kehadiran</label>
                <select 
                  value={student.attendance} 
                  onChange={(e) => onAttendanceChange(student.id, e.target.value as Attendance)}
                  className={`w-full mt-1 p-2 rounded-md border-0 text-center font-semibold ${getAttendanceColor(student.attendance)}`}
                >
                  {Object.values(Attendance).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div className="mt-4">
                <label className="text-sm font-medium text-text-secondary">Partisipasi</label>
                <div className="flex items-center justify-center mt-1">
                  <button onClick={() => onParticipationChange(student.id, -1)} className="px-3 py-1 bg-gray-200 rounded-l-md hover:bg-gray-300">-</button>
                  <span className="px-4 py-1 bg-gray-100 font-bold text-primary">{student.participation}</span>
                  <button onClick={() => onParticipationChange(student.id, 1)} className="px-3 py-1 bg-gray-200 rounded-r-md hover:bg-gray-300">+</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
         <Card>
          <div className="text-center text-text-secondary p-12">
            <h3 className="text-xl font-bold text-text-main mb-2">Tidak Ada Siswa di Kelas Ini</h3>
            <p>Silakan tambahkan beberapa siswa ke kelas ini di menu 'Manajemen Kelas' untuk memulai pelacakan.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentTrackerView;