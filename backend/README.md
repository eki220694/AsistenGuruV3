# Asisten Guru Backend

This is the backend API for the Asisten Guru application, built with Node.js, Express, and MongoDB.

## Features

- User authentication with Google OAuth
- Classroom management
- Student tracking
- Lesson planning
- Quiz generation
- RESTful API

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JSON Web Tokens (JWT)** - Authentication
- **Google OAuth** - User authentication
- **Google Generative AI** - AI-powered lesson plans and quizzes

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google OAuth credentials
- Google Generative AI API key

## Setup Instructions

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/asistenguru
   JWT_SECRET=your_jwt_secret_here
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **For production:**
   ```bash
   npm start
   ```

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

## Database Schema

The application uses MongoDB with the following collections:

1. **Teachers** - User information
2. **Classrooms** - Classroom information
3. **Subjects** - Subject information
4. **Students** - Student information
5. **LessonPlans** - Lesson plan information
6. **Quizzes** - Quiz information

## Development

To run the development server with auto-restart:
```bash
npm run dev
```

To run the production server:
```bash
npm start
```

## Deployment

The backend can be deployed to any Node.js hosting platform like:
- Heroku
- Render
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Google Cloud Run

Make sure to set the environment variables in your deployment platform.