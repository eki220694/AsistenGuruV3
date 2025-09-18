import type { Student, LessonPlan, Quiz, Classroom, Subject } from '../types';

export const validateStudent = (student: Partial<Student>): student is Pick<Student, 'name'> => {
  return !!(student.name && student.name.trim().length > 0);
};

export const validateClassroom = (classroom: Partial<Classroom>): boolean => {
  return !!(
    classroom.name && 
    classroom.name.trim().length > 0 &&
    classroom.subject &&
    classroom.subject.id &&
    classroom.subject.name
  );
};

export const validateSubject = (subject: Partial<Subject>): subject is Subject => {
  return !!(
    subject.id && 
    subject.name && 
    subject.name.trim().length > 0
  );
};

export const validateLesson = (lesson: Partial<LessonPlan>): boolean => {
  return !!(
    lesson.title && 
    lesson.title.trim().length > 0 &&
    lesson.topic &&
    lesson.date
  );
};

export const validateQuiz = (quiz: Partial<Quiz>): boolean => {
  return !!(
    quiz.title && 
    quiz.title.trim().length > 0 &&
    quiz.questions &&
    Array.isArray(quiz.questions) &&
    quiz.questions.length > 0
  );
};

export const validateQuizQuestion = (question: any): boolean => {
  return !!(
    question &&
    question.question &&
    question.question.trim().length > 0 &&
    question.options &&
    Array.isArray(question.options) &&
    question.options.length >= 2 &&
    typeof question.correctAnswer === 'number' &&
    question.correctAnswer >= 0 &&
    question.correctAnswer < question.options.length
  );
};

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const validateArrayNotEmpty = <T>(arr: T[]): boolean => {
  return Array.isArray(arr) && arr.length > 0;
};

export const validateStringLength = (str: string, min: number = 1, max: number = 1000): boolean => {
  const trimmed = str.trim();
  return trimmed.length >= min && trimmed.length <= max;
};

// Grade validation (assuming grades are 0-100)
export const validateGrade = (grade: number): boolean => {
  return typeof grade === 'number' && grade >= 0 && grade <= 100;
};

// Participation validation (assuming participation is 0 or positive)
export const validateParticipation = (participation: number): boolean => {
  return typeof participation === 'number' && participation >= 0;
};

// Comprehensive validation for creating new items
export const validateNewStudent = (name: string): { isValid: boolean; error?: string } => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (!validateStringLength(name, 2, 100)) {
    return { isValid: false, error: 'Name must be between 2 and 100 characters' };
  }
  
  return { isValid: true };
};

export const validateNewClassroom = (name: string, subject: Subject): { isValid: boolean; error?: string } => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Classroom name is required' };
  }
  
  if (!validateStringLength(name, 2, 100)) {
    return { isValid: false, error: 'Classroom name must be between 2 and 100 characters' };
  }
  
  if (!subject || !validateSubject(subject)) {
    return { isValid: false, error: 'Valid subject is required' };
  }
  
  return { isValid: true };
};

export const validateNewLesson = (lesson: Partial<LessonPlan>): { isValid: boolean; error?: string } => {
  if (!lesson.title || !lesson.title.trim()) {
    return { isValid: false, error: 'Lesson title is required' };
  }
  
  if (!validateStringLength(lesson.title, 2, 200)) {
    return { isValid: false, error: 'Lesson title must be between 2 and 200 characters' };
  }
  
  if (!lesson.date) {
    return { isValid: false, error: 'Lesson date is required' };
  }
  
  if (!validateDate(lesson.date)) {
    return { isValid: false, error: 'Invalid lesson date' };
  }
  
  if (!lesson.topic || !lesson.topic.trim()) {
    return { isValid: false, error: 'Lesson topic is required' };
  }
  
  return { isValid: true };
};

export const validateNewQuiz = (quiz: Partial<Quiz>): { isValid: boolean; error?: string } => {
  if (!quiz.title || !quiz.title.trim()) {
    return { isValid: false, error: 'Quiz title is required' };
  }
  
  if (!validateStringLength(quiz.title, 2, 200)) {
    return { isValid: false, error: 'Quiz title must be between 2 and 200 characters' };
  }
  
  if (!quiz.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    return { isValid: false, error: 'Quiz must have at least one question' };
  }
  
  // Validate each question
  for (let i = 0; i < quiz.questions.length; i++) {
    if (!validateQuizQuestion(quiz.questions[i])) {
      return { isValid: false, error: `Question ${i + 1} is invalid` };
    }
  }
  
  return { isValid: true };
};