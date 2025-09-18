# Asisten Guru Architecture Overview

This document provides an overview of the architecture of the Asisten Guru application.

## System Architecture

The application follows a client-server architecture with the following components:

### Frontend (Client)
- **Technology**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React hooks (useState, useEffect, useContext, useMemo)
- **Authentication**: Google OAuth 2.0
- **AI Integration**: Google Generative AI (Gemini)

### Backend (Server)
- **Technology**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Google Generative AI (Gemini)

### Data Flow

1. **User Authentication**:
   - User signs in with Google account
   - Frontend receives Google ID token
   - Frontend sends token to backend
   - Backend verifies token with Google
   - Backend creates/updates user and generates JWT
   - Frontend stores JWT for future requests

2. **Data Management**:
   - Frontend makes API calls to backend for all data operations
   - Backend handles CRUD operations with MongoDB
   - Data is synchronized between frontend and backend

3. **AI Integration**:
   - User requests AI-generated content (lesson plans, quizzes)
   - Frontend sends request to backend
   - Backend calls Google Generative AI API
   - AI response is processed and returned to frontend
   - Frontend displays AI-generated content

## Component Structure

### Frontend Components

```
asistenguruv3/
├── components/
│   ├── common/           # Reusable UI components
│   ├── DashboardView.tsx # Dashboard with class overview
│   ├── LessonPlannerView.tsx # Lesson planning interface
│   ├── StudentTrackerView.tsx # Student attendance and participation
│   ├── AssessmentView.tsx # Quiz management and grading
│   ├── ClassView.tsx     # Classroom management
│   ├── LoginView.tsx     # Authentication interface
│   ├── Sidebar.tsx       # Navigation sidebar
│   └── TestRunnerView.tsx # AI testing interface
├── contexts/
│   └── AuthContext.tsx   # Authentication state management
├── services/
│   ├── apiService.ts     # HTTP client configuration
│   ├── authService.ts    # Authentication API calls
│   ├── dataService.ts    # Data API calls
│   └── geminiService.ts  # AI integration
├── types.ts              # TypeScript interfaces and enums
├── constants.ts          # Mock data (for development)
├── App.tsx               # Main application component
└── main.tsx              # Entry point
```

### Backend Components

```
backend/
├── controllers/          # Request handlers
│   ├── authController.js # Authentication logic
│   ├── classroomController.js # Classroom management
│   ├── lessonController.js # Lesson planning
│   ├── quizController.js # Quiz management
│   ├── studentController.js # Student tracking
│   └── subjectController.js # Subject management
├── middleware/           # Request middleware
│   └── auth.js           # Authentication middleware
├── models/               # Database models
│   ├── Teacher.js        # Teacher schema
│   ├── Classroom.js      # Classroom schema
│   ├── Subject.js        # Subject schema
│   ├── Student.js        # Student schema
│   ├── LessonPlan.js     # Lesson plan schema
│   └── Quiz.js           # Quiz schema
├── routes/               # API route definitions
│   ├── auth.js           # Authentication routes
│   ├── classrooms.js     # Classroom routes
│   ├── lessons.js        # Lesson routes
│   ├── quizzes.js        # Quiz routes
│   ├── students.js       # Student routes
│   └── subjects.js       # Subject routes
├── services/             # Business logic
│   └── authService.js    # Authentication services
├── utils/                # Utility functions
├── server.js             # Main server file
└── package.json          # Dependencies and scripts
```

## Data Models

### Teacher
- `googleId`: Google user ID
- `name`: Teacher's name
- `email`: Teacher's email
- `avatar`: Profile picture URL
- `createdAt`: Account creation date

### Classroom
- `name`: Classroom name
- `subject`: Reference to Subject
- `teacher`: Reference to Teacher
- `studentIds`: Array of student IDs
- `createdAt`: Creation date

### Subject
- `name`: Subject name

### Student
- `id`: Student ID
- `name`: Student name
- `avatar`: Profile picture URL
- `attendance`: Current attendance status
- `participation`: Participation score
- `grades`: Map of quiz IDs to scores

### LessonPlan
- `classroomId`: Reference to Classroom
- `title`: Lesson title
- `date`: Lesson date
- `topic`: Lesson topic
- `objectives`: Learning objectives
- `materials`: Required materials
- `activities`: Lesson activities
- `assessment`: Assessment method

### Quiz
- `classroomId`: Reference to Classroom
- `title`: Quiz title
- `topic`: Quiz topic
- `questions`: Array of quiz questions
  - `question`: Question text
  - `options`: Answer options
  - `correctAnswer`: Correct answer

## API Endpoints

### Authentication
- `POST /api/auth/google` - Google login
- `GET /api/auth/profile` - Get teacher profile

### Classrooms
- `GET /api/classrooms` - Get all classrooms
- `POST /api/classrooms` - Create a new classroom
- `PUT /api/classrooms/:id` - Update a classroom
- `DELETE /api/classrooms/:id` - Delete a classroom

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create a new subject

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create a new student
- `PUT /api/students/:id/attendance` - Update student attendance
- `PUT /api/students/:id/participation` - Update student participation

### Lessons
- `GET /api/lessons` - Get lessons for a classroom
- `POST /api/lessons` - Create a new lesson
- `DELETE /api/lessons/:id` - Delete a lesson

### Quizzes
- `GET /api/quizzes` - Get quizzes for a classroom
- `POST /api/quizzes` - Create a new quiz

## Security Considerations

1. **Authentication**: All API endpoints (except auth) require JWT authentication
2. **Authorization**: Users can only access their own data
3. **Data Validation**: All inputs are validated on both frontend and backend
4. **Error Handling**: Proper error messages without exposing sensitive information
5. **Environment Variables**: Sensitive data stored in environment variables

## Deployment

### Frontend
Can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages

### Backend
Can be deployed to any Node.js hosting platform:
- Heroku
- Render
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Google Cloud Run

Both frontend and backend should use environment variables for configuration.