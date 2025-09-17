import api from './apiService';
import type { Classroom, Subject, Student, LessonPlan, Quiz } from '../types';

// Classroom services
export const getClassrooms = async (): Promise<Classroom[]> => {
  const response = await api.get('/classrooms');
  return response.data.classrooms;
};

export const createClassroom = async (name: string, subjectId: string): Promise<Classroom> => {
  const response = await api.post('/classrooms', { name, subjectId });
  return response.data.classroom;
};

export const updateClassroom = async (id: string, name: string, subjectId: string): Promise<Classroom> => {
  const response = await api.put(`/classrooms/${id}`, { name, subjectId });
  return response.data.classroom;
};

export const deleteClassroom = async (id: string): Promise<void> => {
  await api.delete(`/classrooms/${id}`);
};

// Subject services
export const getSubjects = async (): Promise<Subject[]> => {
  const response = await api.get('/subjects');
  return response.data.subjects;
};

export const createSubject = async (name: string): Promise<Subject> => {
  const response = await api.post('/subjects', { name });
  return response.data.subject;
};

// Student services
export const getStudents = async (): Promise<Student[]> => {
  const response = await api.get('/students');
  return response.data.students;
};

export const createStudent = async (name: string, avatar: string): Promise<Student> => {
  // Generate a unique ID for the student
  const id = Date.now();
  const response = await api.post('/students', { id, name, avatar });
  return response.data.student;
};

export const updateStudentAttendance = async (studentId: number, attendance: string): Promise<Student> => {
  const response = await api.put(`/students/${studentId}/attendance`, { attendance });
  return response.data.student;
};

export const updateStudentParticipation = async (studentId: number, change: number): Promise<Student> => {
  const response = await api.put(`/students/${studentId}/participation`, { change });
  return response.data.student;
};

// Lesson services
export const getLessons = async (classroomId: string): Promise<LessonPlan[]> => {
  const response = await api.get('/lessons', { params: { classroomId } });
  return response.data.lessons;
};

export const createLesson = async (lesson: Omit<LessonPlan, 'id'>): Promise<LessonPlan> => {
  const response = await api.post('/lessons', lesson);
  return response.data.lesson;
};

export const deleteLesson = async (id: string): Promise<void> => {
  await api.delete(`/lessons/${id}`);
};

// Quiz services
export const getQuizzes = async (classroomId: string): Promise<Quiz[]> => {
  const response = await api.get('/quizzes', { params: { classroomId } });
  return response.data.quizzes;
};

export const createQuiz = async (quiz: Omit<Quiz, 'id'>): Promise<Quiz> => {
  const response = await api.post('/quizzes', quiz);
  return response.data.quiz;
};