import React, { useState, useMemo, useEffect } from 'react';
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
import { MOCK_STUDENTS, MOCK_LESSON_PLANS, MOCK_QUIZZES, MOCK_TEACHER, MOCK_CLASSROOMS, MOCK_SUBJECTS } from './constants';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [activeView, setActiveView] = useState<View>(View.Dashboard);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global state for all data
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [classrooms, setClassrooms] = useState<Classroom[]>(MOCK_CLASSROOMS);
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [lessons, setLessons] = useState<LessonPlan[]>(MOCK_LESSON_PLANS);
  const [quizzes, setQuizzes] = useState<Quiz[]>(MOCK_QUIZZES);
  
  const [activeClassroomId, setActiveClassroomId] = useState<string | null>(MOCK_CLASSROOMS[0]?.id || null);

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

  const handleLogin = () => {
    setTeacher(MOCK_TEACHER);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setTeacher(null);
    setActiveView(View.Dashboard);
  };
  
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
  const addLesson = (lesson: Omit<LessonPlan, 'id' | 'classroomId'>) => {
    if (!activeClassroomId) return;
    const newLesson: LessonPlan = { ...lesson, id: `lp-${Date.now()}`, classroomId: activeClassroomId };
    setLessons(prev => [...prev, newLesson]);
  };

  const deleteLesson = (lessonId: string) => {
    setLessons(prev => prev.filter(l => l.id !== lessonId));
  };
  
  const addQuiz = (quiz: Omit<Quiz, 'id' | 'classroomId'>) => {
    if (!activeClassroomId) return;
    const newQuiz: Quiz = { ...quiz, id: `q-${Date.now()}`, classroomId: activeClassroomId };
    setQuizzes(prev => [...prev, newQuiz]);
  };

  const addSubject = (name: string): Subject => {
    const newSubject: Subject = { id: `subj-${Date.now()}`, name };
    setSubjects(prev => [...prev, newSubject]);
    return newSubject;
  };
  
  const addClassroom = (name: string, subject: Subject) => {
    const newClassroom: Classroom = {
      id: `c-${Date.now()}`,
      name,
      subject,
      studentIds: [],
    };
    setClassrooms(prev => [...prev, newClassroom]);
    // Set the newly created class as active
    setActiveClassroomId(newClassroom.id);
  };

  const updateClassroom = (classroomId: string, newName: string, newSubject: Subject) => {
    setClassrooms(prev => prev.map(c => 
      c.id === classroomId ? { ...c, name: newName, subject: newSubject } : c
    ));
  };
  
  const deleteClassroom = (classroomId: string) => {
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
  };
  
  const addStudentToClass = (name: string, classroomId: string) => {
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
  };
  
  const deleteStudentFromClass = (studentId: number, classroomId: string) => {
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
  };
  
  const handleAttendanceChange = (studentId: number, newAttendance: Attendance) => {
    setStudents(prevStudents => 
      prevStudents.map(s => 
        s.id === studentId ? { ...s, attendance: newAttendance } : s
      )
    );
  };

  const handleParticipationChange = (studentId: number, change: number) => {
    setStudents(prevStudents => 
      prevStudents.map(s => 
        s.id === studentId ? { ...s, participation: Math.max(0, s.participation + change) } : s
      )
    );
  };

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
    return <LoginView onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="relative min-h-screen md:flex font-sans text-text-main bg-background">
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        teacher={teacher}
        onLogout={handleLogout}
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
        {renderView()}
      </main>
    </div>
  );
};

export default App;