import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import LessonPlannerView from './components/LessonPlannerView';
import StudentTrackerView from './components/StudentTrackerView';
import AssessmentView from './components/AssessmentView';
import LoginView from './components/LoginView';
import TestRunnerView from './components/TestRunnerView';
import ClassView from './components/ClassView';
import ErrorBoundary from './components/ErrorBoundary';
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
import { validateClassroom, validateStudent, validateLesson } from './utils/validation';
import { logger } from './utils/logger';

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
  const [error, setError] = useState<string | null>(null);

  // Handle active classroom changes
  useEffect(() => {
    try {
      // If there are classrooms but none is active, set the first one as active.
      if (classrooms.length > 0 && !activeClassroomId) {
        setActiveClassroomId(classrooms[0].id);
        logger.info('Set active classroom to first available:', classrooms[0].id);
      }
      
      // If the active classroom was deleted, switch to the first available, or null.
      if (activeClassroomId && !classrooms.find(c => c.id === activeClassroomId)) {
        const newActiveId = classrooms[0]?.id || null;
        setActiveClassroomId(newActiveId);
        logger.info('Active classroom deleted, switching to:', newActiveId);
      }
      
      // If there are no classrooms, set active classroom to null.
      if (classrooms.length === 0) {
        setActiveClassroomId(null);
        logger.info('No classrooms available, clearing active classroom');
      }
    } catch (err) {
      logger.error('Error handling active classroom changes:', err);
      setError('Terjadi kesalahan saat mengelola kelas aktif');
    }
  }, [classrooms, activeClassroomId]);

  // Load data from backend when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      const loadData = async () => {
        setLoading(true);
        setError(null);
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
          logger.info('Data loaded successfully');
        } catch (err) {
          logger.error('Error loading data:', err);
          setError('Gagal memuat data. Silakan coba lagi.');
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    }
  }, [isLoggedIn, activeClassroomId]);

  // Computed values with memoization
  const activeClassroom = useMemo(() => {
    try {
      return classrooms.find(c => c.id === activeClassroomId) || null;
    } catch (err) {
      logger.error('Error computing active classroom:', err);
      return null;
    }
  }, [classrooms, activeClassroomId]);

  const filteredStudents = useMemo(() => {
    try {
      if (!activeClassroom) return [];
      return students.filter(s => activeClassroom.studentIds.includes(s.id));
    } catch (err) {
      logger.error('Error filtering students:', err);
      return [];
    }
  }, [students, activeClassroom]);
  
  const filteredLessons = useMemo(() => {
    try {
      return lessons.filter(l => l.classroomId === activeClassroomId);
    } catch (err) {
      logger.error('Error filtering lessons:', err);
      return [];
    }
  }, [lessons, activeClassroomId]);
  
  const filteredQuizzes = useMemo(() => {
    try {
      return quizzes.filter(q => q.classroomId === activeClassroomId);
    } catch (err) {
      logger.error('Error filtering quizzes:', err);
      return [];
    }
  }, [quizzes, activeClassroomId]);

  // State mutation functions
  const addLesson = useCallback(async (lesson: Omit<LessonPlan, 'id' | 'classroomId'>) => {
    try {
      if (!activeClassroomId) {
        logger.warn('Cannot add lesson: no active classroom');
        setError('Tidak dapat menambahkan pelajaran: tidak ada kelas aktif');
        return;
      }

      if (!validateLesson(lesson)) {
        logger.error('Invalid lesson data:', lesson);
        setError('Data pelajaran tidak valid');
        return;
      }

      // In a real implementation:
      // const newLesson = await createLessonAPI({
      //   ...lesson,
      //   classroomId: activeClassroomId
      // });
      // setLessons(prev => [...prev, newLesson]);
      
      // For now, using mock implementation:
      const newLesson: LessonPlan = { ...lesson, id: `lp-${Date.now()}`, classroomId: activeClassroomId };
      setLessons(prev => [...prev, newLesson]);
      logger.info('Lesson added successfully:', newLesson.id);
      setError(null);
    } catch (err) {
      logger.error('Error adding lesson:', err);
      setError('Gagal menambahkan pelajaran. Silakan coba lagi.');
    }
  }, [activeClassroomId]);

  const deleteLesson = useCallback(async (lessonId: string) => {
    try {
      logger.info('Attempting to delete lesson:', lessonId);
      
      // In a real implementation:
      // await deleteLessonAPI(lessonId);
      // setLessons(prev => prev.filter(l => l.id !== lessonId));
      
      // For now, using mock implementation:
      setLessons(prev => prev.filter(l => l.id !== lessonId));
      logger.info('Lesson deleted successfully. Remaining lessons:', prev.length);
      setError(null);
    } catch (err) {
      logger.error('Error deleting lesson:', err);
      setError('Gagal menghapus pelajaran. Silakan coba lagi.');
    }
  }, []);

  const addQuiz = useCallback(async (quiz: Omit<Quiz, 'id' | 'classroomId'>) => {
    try {
      if (!activeClassroomId) {
        logger.warn('Cannot add quiz: no active classroom');
        setError('Tidak dapat menambahkan kuis: tidak ada kelas aktif');
        return;
      }
      
      // In a real implementation:
      // const newQuiz = await createQuizAPI({
      //   ...quiz,
      //   classroomId: activeClassroomId
      // });
      // setQuizzes(prev => [...prev, newQuiz]);
      
      // For now, using mock implementation:
      const newQuiz: Quiz = { ...quiz, id: `q-${Date.now()}`, classroomId: activeClassroomId };
      setQuizzes(prev => [...prev, newQuiz]);
      logger.info('Quiz added successfully:', newQuiz.id);
      setError(null);
    } catch (err) {
      logger.error('Error adding quiz:', err);
      setError('Gagal menambahkan kuis. Silakan coba lagi.');
    }
  }, [activeClassroomId]);

  const addSubject = useCallback(async (name: string): Promise<Subject> => {
    try {
      if (!name.trim()) {
        throw new Error('Subject name cannot be empty');
      }

      // In a real implementation:
      // const newSubject = await createSubjectAPI(name);
      // setSubjects(prev => [...prev, newSubject]);
      // return newSubject;
      
      // For now, using mock implementation:
      const newSubject: Subject = { id: `subj-${Date.now()}`, name: name.trim() };
      setSubjects(prev => [...prev, newSubject]);
      logger.info('Subject added successfully:', newSubject.id);
      setError(null);
      return newSubject;
    } catch (err) {
      logger.error('Error adding subject:', err);
      setError('Gagal menambahkan mata pelajaran. Silakan coba lagi.');
      // Return a default subject in case of error
      return { id: `subj-error`, name: 'Error' };
    }
  }, []);

  const addClassroom = useCallback(async (name: string, subject: Subject) => {
    try {
      const classroomData = { name: name.trim(), subject, studentIds: [] };
      
      if (!validateClassroom(classroomData)) {
        logger.error('Invalid classroom data:', classroomData);
        setError('Data kelas tidak valid');
        return;
      }

      // In a real implementation:
      // const newClassroom = await createClassroomAPI(name, subject.id);
      // setClassrooms(prev => [...prev, newClassroom]);
      // setActiveClassroomId(newClassroom.id);
      
      // For now, using mock implementation:
      const newClassroom: Classroom = {
        id: `c-${Date.now()}`,
        ...classroomData,
      };
      
      setClassrooms(prev => [...prev, newClassroom]);
      setActiveClassroomId(newClassroom.id);
      logger.info('Classroom added successfully:', newClassroom.id);
      setError(null);
    } catch (err) {
      logger.error('Error adding classroom:', err);
      setError('Gagal menambahkan kelas. Silakan coba lagi.');
    }
  }, []);

  const updateClassroom = useCallback(async (classroomId: string, newName: string, newSubject: Subject) => {
    try {
      const updateData = { name: newName.trim(), subject: newSubject };
      
      if (!validateClassroom({ ...updateData, studentIds: [] })) {
        logger.error('Invalid classroom update data:', updateData);
        setError('Data pembaruan kelas tidak valid');
        return;
      }

      // In a real implementation:
      // const updatedClassroom = await updateClassroomAPI(classroomId, newName, newSubject.id);
      // setClassrooms(prev => prev.map(c => 
      //   c.id === classroomId ? updatedClassroom : c
      // ));
      
      // For now, using mock implementation:
      setClassrooms(prev => prev.map(c => 
        c.id === classroomId ? { ...c, name: newName, subject: newSubject } : c
      ));
      logger.info('Classroom updated successfully:', classroomId);
      setError(null);
    } catch (err) {
      logger.error('Error updating classroom:', err);
      setError('Gagal memperbarui kelas. Silakan coba lagi.');
    }
  }, []);

  const deleteClassroom = useCallback(async (classroomId: string) => {
    try {
      logger.info('Attempting to delete classroom:', classroomId);
      
      // In a real implementation:
      // await deleteClassroomAPI(classroomId);
      
      const classToDelete = classrooms.find(c => c.id === classroomId);
      if (!classToDelete) {
        logger.error('Classroom not found for deletion:', classroomId);
        setError('Kelas tidak ditemukan');
        return;
      }

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
        logger.info('Removed orphaned students:', Array.from(orphanedStudentIds));
      }
      setClassrooms(prev => prev.filter(c => c.id !== classroomId));
      logger.info('Classroom deleted successfully:', classroomId);
      setError(null);
    } catch (err) {
      logger.error('Error deleting classroom:', err);
      setError('Gagal menghapus kelas. Silakan coba lagi.');
    }
  }, [classrooms]);

  const addStudentToClass = useCallback(async (name: string, classroomId: string) => {
    try {
      const studentData = { name: name.trim() };
      
      if (!validateStudent(studentData)) {
        logger.error('Invalid student data:', studentData);
        setError('Data siswa tidak valid');
        return;
      }

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
        name: studentData.name,
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
      logger.info('Student added to class successfully:', newStudent.id);
      setError(null);
    } catch (err) {
      logger.error('Error adding student:', err);
      setError('Gagal menambahkan siswa. Silakan coba lagi.');
    }
  }, []);

  const deleteStudentFromClass = useCallback(async (studentId: number, classroomId: string) => {
    try {
      logger.info('Attempting to remove student from class:', studentId, classroomId);

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
        logger.info('Student removed completely (was orphaned):', studentId);
      } else {
        logger.info('Student removed from class but kept in other classes:', studentId);
      }
      setError(null);
    } catch (err) {
      logger.error('Error removing student from class:', err);
      setError('Gagal menghapus siswa dari kelas. Silakan coba lagi.');
    }
  }, [classrooms]);

  const handleAttendanceChange = useCallback(async (studentId: number, newAttendance: Attendance) => {
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
      logger.info('Attendance updated for student:', studentId, newAttendance);
      setError(null);
    } catch (err) {
      logger.error('Error updating attendance:', err);
      setError('Gagal memperbarui kehadiran. Silakan coba lagi.');
    }
  }, []);

  const handleParticipationChange = useCallback(async (studentId: number, change: number) => {
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
      logger.info('Participation updated for student:', studentId, change);
      setError(null);
    } catch (err) {
      logger.error('Error updating participation:', err);
      setError('Gagal memperbarui partisipasi. Silakan coba lagi.');
    }
  }, []);

  const renderView = useCallback(() => {
    try {
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
        return (
          <DashboardView 
            classroom={null} 
            lessons={[]} 
            quizzes={[]} 
            students={[]} 
            setActiveView={setActiveView} 
          />
        );
      }

      switch (activeView) {
        case View.Dashboard:
          return (
            <DashboardView 
              classroom={activeClassroom} 
              lessons={filteredLessons} 
              quizzes={filteredQuizzes} 
              students={filteredStudents} 
              setActiveView={setActiveView} 
            />
          );
        case View.Planner:
          return (
            <LessonPlannerView 
              lessons={filteredLessons} 
              addLesson={addLesson} 
              deleteLesson={deleteLesson}
              currentTopic={activeClassroom.subject.name} 
            />
          );
        case View.Students:
          return (
            <StudentTrackerView 
              students={filteredStudents} 
              classroom={activeClassroom} 
              onAttendanceChange={handleAttendanceChange}
              onParticipationChange={handleParticipationChange}
            />
          );
        case View.Assessments:
          return (
            <AssessmentView 
              quizzes={filteredQuizzes} 
              students={filteredStudents} 
              addQuiz={addQuiz}
              deleteQuiz={deleteQuiz}
              currentTopic={activeClassroom.subject.name} 
            />
          );
        default:
          return (
            <DashboardView 
              classroom={activeClassroom} 
              lessons={filteredLessons} 
              quizzes={filteredQuizzes} 
              students={filteredStudents} 
              setActiveView={setActiveView} 
            />
          );
      }
    } catch (err) {
      logger.error('Error rendering view:', err);
      setError('Terjadi kesalahan saat memuat tampilan. Silakan coba lagi.');
      return <div className="p-8 text-red-500">Error loading view. Please try again.</div>;
    }
  }, [
    activeView, 
    activeClassroom, 
    filteredLessons, 
    filteredQuizzes, 
    filteredStudents, 
    classrooms, 
    students, 
    subjects, 
    addSubject, 
    addClassroom, 
    updateClassroom, 
    deleteClassroom, 
    addStudentToClass, 
    deleteStudentFromClass, 
    addLesson, 
    deleteLesson, 
    addQuiz, 
    handleAttendanceChange, 
    handleParticipationChange
  ]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  if (!isLoggedIn) {
    return (
      <ErrorBoundary>
        <LoginView />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
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
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="text-gray-600 p-1"
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </header>
          
          {/* Error display */}
          {error && (
            <div className="mx-4 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <div className="flex justify-between items-center">
                <span>{error}</span>
                <button 
                  onClick={clearError}
                  className="text-red-700 hover:text-red-900 font-bold"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            renderView()
          )}
        </main>
      </div>
    </ErrorBoundary>
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