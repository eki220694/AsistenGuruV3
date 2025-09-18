import { useState, useCallback, useMemo } from 'react';
import type { Classroom, Student, LessonPlan, Quiz, Subject } from '../types';
import { validateNewClassroom, validateNewStudent } from '../utils/validation';
import { logger } from '../utils/logger';

interface UseClassroomManagerProps {
  initialClassrooms: Classroom[];
  initialStudents: Student[];
  initialLessons: LessonPlan[];
  initialQuizzes: Quiz[];
}

export const useClassroomManager = ({
  initialClassrooms,
  initialStudents,
  initialLessons,
  initialQuizzes,
}: UseClassroomManagerProps) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>(initialClassrooms);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [lessons, setLessons] = useState<LessonPlan[]>(initialLessons);
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);

  // Get students for a specific classroom
  const getStudentsForClassroom = useCallback((classroomId: string): Student[] => {
    const classroom = classrooms.find(c => c.id === classroomId);
    if (!classroom) return [];
    return students.filter(s => classroom.studentIds.includes(s.id));
  }, [classrooms, students]);

  // Get lessons for a specific classroom
  const getLessonsForClassroom = useCallback((classroomId: string): LessonPlan[] => {
    return lessons.filter(l => l.classroomId === classroomId);
  }, [lessons]);

  // Get quizzes for a specific classroom
  const getQuizzesForClassroom = useCallback((classroomId: string): Quiz[] => {
    return quizzes.filter(q => q.classroomId === classroomId);
  }, [quizzes]);

  // Add a new classroom
  const addClassroom = useCallback((name: string, subject: Subject): string | null => {
    try {
      const validation = validateNewClassroom(name, subject);
      if (!validation.isValid) {
        logger.error('Invalid classroom data:', validation.error);
        throw new Error(validation.error);
      }

      const newClassroom: Classroom = {
        id: `c-${Date.now()}`,
        name: name.trim(),
        subject,
        studentIds: [],
      };

      setClassrooms(prev => [...prev, newClassroom]);
      logger.info('Classroom added successfully:', newClassroom.id);
      return newClassroom.id;
    } catch (error) {
      logger.error('Failed to add classroom:', error);
      return null;
    }
  }, []);

  // Update classroom details
  const updateClassroom = useCallback((classroomId: string, name: string, subject: Subject): boolean => {
    try {
      const validation = validateNewClassroom(name, subject);
      if (!validation.isValid) {
        logger.error('Invalid classroom update data:', validation.error);
        throw new Error(validation.error);
      }

      setClassrooms(prev => prev.map(c => 
        c.id === classroomId 
          ? { ...c, name: name.trim(), subject } 
          : c
      ));
      logger.info('Classroom updated successfully:', classroomId);
      return true;
    } catch (error) {
      logger.error('Failed to update classroom:', error);
      return false;
    }
  }, []);

  // Delete classroom and handle dependencies
  const deleteClassroom = useCallback((classroomId: string): boolean => {
    try {
      logger.info('Starting classroom deletion process:', classroomId);

      const classroomToDelete = classrooms.find(c => c.id === classroomId);
      if (!classroomToDelete) {
        logger.error('Classroom not found for deletion:', classroomId);
        return false;
      }

      // Calculate which students will be orphaned
      const studentsInDeletedClass = new Set(classroomToDelete.studentIds);
      const studentsInOtherClasses = new Set<number>();
      
      classrooms.forEach(c => {
        if (c.id !== classroomId) {
          c.studentIds.forEach(id => studentsInOtherClasses.add(id));
        }
      });

      const orphanedStudents = Array.from(studentsInDeletedClass)
        .filter(id => !studentsInOtherClasses.has(id));

      // Remove related lessons and quizzes
      setLessons(prev => prev.filter(l => l.classroomId !== classroomId));
      setQuizzes(prev => prev.filter(q => q.classroomId !== classroomId));

      // Remove orphaned students
      if (orphanedStudents.length > 0) {
        setStudents(prev => prev.filter(s => !orphanedStudents.includes(s.id)));
        logger.info('Removed orphaned students:', orphanedStudents);
      }

      // Finally remove the classroom
      setClassrooms(prev => prev.filter(c => c.id !== classroomId));
      
      logger.info('Classroom deleted successfully:', classroomId);
      return true;
    } catch (error) {
      logger.error('Failed to delete classroom:', error);
      return false;
    }
  }, [classrooms]);

  // Add student to classroom
  const addStudentToClassroom = useCallback((name: string, classroomId: string): number | null => {
    try {
      const validation = validateNewStudent(name);
      if (!validation.isValid) {
        logger.error('Invalid student data:', validation.error);
        throw new Error(validation.error);
      }

      const classroom = classrooms.find(c => c.id === classroomId);
      if (!classroom) {
        logger.error('Classroom not found:', classroomId);
        throw new Error('Classroom not found');
      }

      const newStudent: Student = {
        id: Date.now(),
        name: name.trim(),
        avatar: `https://picsum.photos/seed/${name.replace(/\s/g, '')}/100`,
        attendance: 'Present' as any, // Assuming Attendance enum
        participation: 0,
        grades: {},
      };

      // Add student to global list
      setStudents(prev => [...prev, newStudent]);

      // Add student ID to classroom
      setClassrooms(prev => prev.map(c => 
        c.id === classroomId 
          ? { ...c, studentIds: [...c.studentIds, newStudent.id] }
          : c
      ));

      logger.info('Student added to classroom successfully:', newStudent.id);
      return newStudent.id;
    } catch (error) {
      logger.error('Failed to add student to classroom:', error);
      return null;
    }
  }, [classrooms]);

  // Remove student from classroom
  const removeStudentFromClassroom = useCallback((studentId: number, classroomId: string): boolean => {
    try {
      logger.info('Removing student from classroom:', studentId, classroomId);

      // Check if student exists in this classroom
      const classroom = classrooms.find(c => c.id === classroomId);
      if (!classroom || !classroom.studentIds.includes(studentId)) {
        logger.error('Student not found in classroom:', studentId, classroomId);
        return false;
      }

      // Check if student will be orphaned
      const isInOtherClasses = classrooms.some(c => 
        c.id !== classroomId && c.studentIds.includes(studentId)
      );

      // Remove from classroom
      setClassrooms(prev => prev.map(c => 
        c.id === classroomId 
          ? { ...c, studentIds: c.studentIds.filter(id => id !== studentId) }
          : c
      ));

      // If orphaned, remove from global list
      if (!isInOtherClasses) {
        setStudents(prev => prev.filter(s => s.id !== studentId));
        logger.info('Student removed completely (was orphaned):', studentId);
      } else {
        logger.info('Student removed from classroom but kept in others:', studentId);
      }

      return true;
    } catch (error) {
      logger.error('Failed to remove student from classroom:', error);
      return false;
    }
  }, [classrooms]);

  // Get classroom statistics
  const getClassroomStats = useCallback((classroomId: string) => {
    const students = getStudentsForClassroom(classroomId);
    const lessons = getLessonsForClassroom(classroomId);
    const quizzes = getQuizzesForClassroom(classroomId);

    return {
      studentCount: students.length,
      lessonCount: lessons.length,
      quizCount: quizzes.length,
      attendanceRate: students.length > 0 
        ? students.filter(s => s.attendance === 'Present').length / students.length 
        : 0,
      averageParticipation: students.length > 0
        ? students.reduce((sum, s) => sum + s.participation, 0) / students.length
        : 0,
    };
  }, [getStudentsForClassroom, getLessonsForClassroom, getQuizzesForClassroom]);

  // Get all classroom statistics
  const getAllClassroomStats = useMemo(() => {
    return classrooms.map(classroom => ({
      classroom,
      stats: getClassroomStats(classroom.id),
    }));
  }, [classrooms, getClassroomStats]);

  return {
    // State
    classrooms,
    students,
    lessons,
    quizzes,

    // Classroom management
    addClassroom,
    updateClassroom,
    deleteClassroom,

    // Student management
    addStudentToClassroom,
    removeStudentFromClassroom,

    // Data getters
    getStudentsForClassroom,
    getLessonsForClassroom,
    getQuizzesForClassroom,
    getClassroomStats,
    getAllClassroomStats,
  };
};