import React, { useState, useMemo, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import LessonPlannerView from './components/LessonPlannerView';
import StudentTrackerView from './components/StudentTrackerView';
import AssessmentView from './components/AssessmentView';
import LoginView from './components/LoginView';
import TestRunnerView from './components/TestRunnerView';
import ClassView from './components/ClassView';
import { View, Attendance } from './types';
import type { Student, LessonPlan, Quiz, Teacher, Classroom, Subject } from './types';
import {
  getClassrooms,
  getStudents,
  getSubjects,
  getLessons,
  getQuizzes,
  createClassroom as createClassroomAPI,
  updateClassroom as updateClassroomAPI,
  deleteClassroom as deleteClassroomAPI,
  createSubject as createSubjectAPI,
  createStudent as createStudentAPI,
  updateStudentAttendance as updateStudentAttendanceAPI,
  updateStudentParticipation as updateStudentParticipationAPI,
  createLesson as createLessonAPI,
  deleteLesson as deleteLessonAPI,
  createQuiz as createQuizAPI
} from './services/dataService';
import { MOCK_STUDENTS, MOCK_LESSON_PLANS, MOCK_QUIZZES, MOCK_TEACHER, MOCK_CLASSROOMS, MOCK_SUBJECTS } from './constants';

const AppContent: React.FC = () => {
  const { isLoggedIn, teacher, logout } = useAuth();
  const [activeView, setActiveView] = useState<View>(View.Dashboard);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global state for all data
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [classrooms, setClassrooms] = useState<Classroom[]>(MOCK_CLASSROOMS);
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [lessons, setLessons] = useState<LessonPlan[]>(MOCK_LESSON_PLANS);
  const [quizzes, setQuizzes] = useState<Quiz[]>(MOCK_QUIZZES);
  
  const [activeClassroomId, setActiveClassroomId] = useState<string | null>(MOCK_CLASSROOMS[0]?.id || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If there are classrooms but none is active, set the first one as active.
    if (classrooms.length > 0 && !activeClassroomId) {
      setActiveClassroomId(classrooms[0].id);
    }
    // If the active classroom was deleted, switch to the first available, or null.
    if (activeClassroomId && !classrooms.find(c => c.id === activeClassroomId)) {
        setActiveClassroomId(classrooms[0]?.id || null);
    }
    // If there are no classrooms, set active classroom to null.
    if (classrooms.length === 0) {
      setActiveClassroomId(null);
    }
  }, [classrooms, activeClassroomId]);

  // Load data from backend when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      const loadData = async () => {
        setLoading(true);
        try {
          // In a real implementation, these would be called:
          // const classroomsData = await getClassrooms();
          // const studentsData = await getStudents();
          // const subjectsData = await getSubjects();
          // const lessonsData = await getLessons(activeClassroomId || '');
          // const quizzesData = await getQuizzes(activeClassroomId || '');
          // 
          // setClassrooms(classroomsData);
          // setStudents(studentsData);
          // setSubjects(subjectsData);
          // setLessons(lessonsData);
          // setQuizzes(quizzesData);
          
          // For now, we'll continue using mock data
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    }
  }, [isLoggedIn, activeClassroomId]);

  const activeClassroom = useMemo(() => {
    return classrooms.find(c => c.id === activeClassroomId) || null;
  }, [classrooms, activeClassroomId]);

  const filteredStudents = useMemo(() => {
    if (!activeClassroom) return [];
    return students.filter(s => activeClassroom.studentIds.includes(s.id));
  }, [students, activeClassroom]);
  
  const filteredLessons = useMemo(() => lessons.filter(l => l.classroomId === activeClassroomId), [lessons, activeClassroomId]);
  const filteredQuizzes = useMemo(() => quizzes.filter(q => q.classroomId === activeClassroomId), [quizzes, activeClassroomId]);
  
  // State mutation functions
  const addLesson = async (lesson: Omit<LessonPlan, 'id' | 'classroomId'>) => {
    if (!activeClassroomId) return;
    
    try {
      // In a real implementation:
      // const newLesson = await createLessonAPI({
      //   ...lesson,
      //   classroomId: activeClassroomId
      // });
      // setLessons(prev => [...prev, newLesson]);
      
      // For now, using mock implementation:
      const newLesson: LessonPlan = { ...lesson, id: `lp-${Date.now()}`, classroomId: activeClassroomId };
      setLessons(prev => [...prev, newLesson]);
    } catch (error) {
      console.error('Error adding lesson:', error);
      alert('Gagal menambahkan pelajaran. Silakan coba lagi.');
    }
  };

  const deleteLesson = async (lessonId: string) => {
    try {
      // In a real implementation:
      // await deleteLessonAPI(lessonId);
      // setLessons(prev => prev.filter(l => l.id !== lessonId));
      
      // For now, using mock implementation:
      setLessons(prev => prev.filter(l => l.id !== lessonId));
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Gagal menghapus pelajaran. Silakan coba lagi.');
    }
  }
  
  const addQuiz = async (quiz: Omit<Quiz, 'id' | 'classroomId'>) => {
    if (!activeClassroomId) return;
    
    try {
      // In a real implementation:
      // const newQuiz = await createQuizAPI({
      //   ...quiz,
      //   classroomId: activeClassroomId
      // });
      // setQuizzes(prev => [...prev, newQuiz]);
      
      // For now, using mock implementation:
      const newQuiz: Quiz = { ...quiz, id: `q-${Date.now()}`, classroomId: activeClassroomId };
      setQuizzes(prev => [...prev, newQuiz]);
    } catch (error) {
      console.error('Error adding quiz:', error);
      alert('Gagal menambahkan kuis. Silakan coba lagi.');
    }
  };

  const addSubject = async (name: string): Promise<Subject> => {
    try {
      // In a real implementation:
      // const newSubject = await createSubjectAPI(name);
      // setSubjects(prev => [...prev, newSubject]);
      // return newSubject;
      
      // For now, using mock implementation:
      const newSubject: Subject = { id: `subj-${Date.now()}`, name };
      setSubjects(prev => [...prev, newSubject]);
      return newSubject;
    } catch (error) {
      console.error('Error adding subject:', error);
      alert('Gagal menambahkan mata pelajaran. Silakan coba lagi.');
      // Return a default subject in case of error
      return { id: `subj-error`, name: 'Error' };
    }
  }
  
  const addClassroom = async (name: string, subject: Subject) => {
    try {
      // In a real implementation:
      // const newClassroom = await createClassroomAPI(name, subject.id);
      // setClassrooms(prev => [...prev, newClassroom]);
      // setActiveClassroomId(newClassroom.id);
      
      // For now, using mock implementation:
      const newClassroom: Classroom = {
        id: `c-${Date.now()}`,
        name,
        subject,
        studentIds: [],
      };
      setClassrooms(prev => [...prev, newClassroom]);
      // Set the newly created class as active
      setActiveClassroomId(newClassroom.id);
    } catch (error) {
      console.error('Error adding classroom:', error);
      alert('Gagal menambahkan kelas. Silakan coba lagi.');
    }
  };

  const updateClassroom = async (classroomId: string, newName: string, newSubject: Subject) => {
    try {
      // In a real implementation:
      // const updatedClassroom = await updateClassroomAPI(classroomId, newName, newSubject.id);
      // setClassrooms(prev => prev.map(c => 
      //   c.id === classroomId ? updatedClassroom : c
      // ));
      
      // For now, using mock implementation:
      setClassrooms(prev => prev.map(c => 
        c.id === classroomId ? { ...c, name: newName, subject: newSubject } : c
      ));
    } catch (error) {
      console.error('Error updating classroom:', error);
      alert('Gagal memperbarui kelas. Silakan coba lagi.');
    }
  }
  
  const deleteClassroom = async (classroomId: string) => {
    try {
      // In a real implementation:
      // await deleteClassroomAPI(classroomId);
      
      const classToDelete = classrooms.find(c => c.id === classroomId);
      if (!classToDelete) return;

      const studentIdsInDeletedClass = new Set(classToDelete.studentIds);
      const studentIdsInOtherClasses = new Set<number>();
      
      classrooms.forEach(c => {
        if (c.id !== classroomId) {
          c.studentIds.forEach(id => studentIdsInOtherClasses.add(id));
        }
      });

      const orphanedStudentIds = new Set<number>();
      studentIdsInDeletedClass.forEach(id => {
        if (!studentIdsInOtherClasses.has(id)) {
          orphanedStudentIds.add(id);
        }
      });

      setLessons(prev => prev.filter(l => l.classroomId !== classroomId));
      setQuizzes(prev => prev.filter(q => q.classroomId !== classroomId));
      if (orphanedStudentIds.size > 0) {
        setStudents(prev => prev.filter(s => !orphanedStudentIds.has(s.id)));
      }
      setClassrooms(prev => prev.filter(c => c.id !== classroomId));
    } catch (error) {
      console.error('Error deleting classroom:', error);
      alert('Gagal menghapus kelas. Silakan coba lagi.');
    }
  }
  
  const addStudentToClass = async (name: string, classroomId: string) => {
    try {
      // In a real implementation:
      // const newStudent = await createStudentAPI(name, `https://picsum.photos/seed/${name.replace(/\s/g, '')}/100`);
      // setStudents(prev => [...prev, newStudent]);
      // setClassrooms(prev => prev.map(c => 
      //   c.id === classroomId 
      //     ? { ...c, studentIds: [...c.studentIds, newStudent.id] } 
      //     : c
      // ));
      
      // For now, using mock implementation:
      const newStudent: Student = {
        id: Date.now(),
        name,
        avatar: `https://picsum.photos/seed/${name.replace(/\s/g, '')}/100`,
        attendance: Attendance.Present,
        participation: 0,
        grades: {},
      };
      setStudents(prev => [...prev, newStudent]);
      setClassrooms(prev => prev.map(c => 
        c.id === classroomId 
          ? { ...c, studentIds: [...c.studentIds, newStudent.id] } 
          : c
      ));
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Gagal menambahkan siswa. Silakan coba lagi.');
    }
  }
  
  const deleteStudentFromClass = async (studentId: number, classroomId: string) => {
    try {
      let isOrphaned = true;
      for (const classroom of classrooms) {
        if (classroom.id !== classroomId && classroom.studentIds.includes(studentId)) {
          isOrphaned = false;
          break;
        }
      }
      
      setClassrooms(prev => prev.map(c => 
        c.id === classroomId 
          ? { ...c, studentIds: c.studentIds.filter(id => id !== studentId) } 
          : c
      ));

      if (isOrphaned) {
        setStudents(prev => prev.filter(s => s.id !== studentId));
      }
    } catch (error) {
      console.error('Error removing student from class:', error);
      alert('Gagal menghapus siswa dari kelas. Silakan coba lagi.');
    }
  }
  
  const handleAttendanceChange = async (studentId: number, newAttendance: Attendance) => {
    try {
      // In a real implementation:
      // const updatedStudent = await updateStudentAttendanceAPI(studentId, newAttendance);
      // setStudents(prevStudents => 
      //   prevStudents.map(s => 
      //     s.id === studentId ? updatedStudent : s
      //   )
      // );
      
      // For now, using mock implementation:
      setStudents(prevStudents => 
        prevStudents.map(s => 
          s.id === studentId ? { ...s, attendance: newAttendance } : s
        )
      );
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Gagal memperbarui kehadiran. Silakan coba lagi.');
    }
  };

  const handleParticipationChange = async (studentId: number, change: number) => {
    try {
      // In a real implementation:
      // const updatedStudent = await updateStudentParticipationAPI(studentId, change);
      // setStudents(prevStudents => 
      //   prevStudents.map(s => 
      //     s.id === studentId ? updatedStudent : s
      //   )
      // );
      
      // For now, using mock implementation:
      setStudents(prevStudents => 
        prevStudents.map(s => 
          s.id === studentId ? { ...s, participation: Math.max(0, s.participation + change) } : s
        )
      );
    } catch (error) {
      console.error('Error updating participation:', error);
      alert('Gagal memperbarui partisipasi. Silakan coba lagi.');
    }
  }

  const renderView = () => {
    if (activeView === View.TestRunner) {
        return <TestRunnerView setActiveView={setActiveView} />;
    }
    
    if (activeView === View.Class) {
        return (
            <ClassView
                classrooms={classrooms}
                allStudents={students}
                subjects={subjects}
                addSubject={addSubject}
                addClassroom={addClassroom}
                updateClassroom={updateClassroom}
                deleteClassroom={deleteClassroom}
                addStudentToClass={addStudentToClass}
                deleteStudentFromClass={deleteStudentFromClass}
            />
        );
    }
    
    if (!activeClassroom) {
        return <DashboardView classroom={null} lessons={[]} quizzes={[]} students={[]} setActiveView={setActiveView} />;
    }

    switch (activeView) {
      case View.Dashboard:
        return <DashboardView classroom={activeClassroom} lessons={filteredLessons} quizzes={filteredQuizzes} students={filteredStudents} setActiveView={setActiveView} />;
      case View.Planner:
        return <LessonPlannerView lessons={filteredLessons} addLesson={addLesson} deleteLesson={deleteLesson} currentTopic={activeClassroom.subject.name} />;
      case View.Students:
        return <StudentTrackerView 
                  students={filteredStudents} 
                  classroom={activeClassroom} 
                  onAttendanceChange={handleAttendanceChange}
                  onParticipationChange={handleParticipationChange}
                />;
      case View.Assessments:
        return <AssessmentView quizzes={filteredQuizzes} students={filteredStudents} addQuiz={addQuiz} currentTopic={activeClassroom.subject.name} />;
      default:
        return <DashboardView classroom={activeClassroom} lessons={filteredLessons} quizzes={filteredQuizzes} students={filteredStudents} setActiveView={setActiveView} />;
    }
  };

  if (!isLoggedIn) {
    return <LoginView />;
  }

  return (
    <div className="relative min-h-screen md:flex font-sans text-text-main bg-background">
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        teacher={teacher}
        onLogout={logout}
        classrooms={classrooms}
        activeClassroomId={activeClassroomId}
        setActiveClassroomId={setActiveClassroomId}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <main className="flex-1 overflow-y-auto">
        <header className="md:hidden sticky top-0 bg-white shadow-sm z-20 flex items-center justify-between p-4">
            <h1 className="text-xl font-bold text-primary">{activeClassroom?.name || 'Dasbor'}</h1>
            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 p-1">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </header>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          renderView()
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;