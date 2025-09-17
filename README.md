<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Asisten Guru - Teacher Assistant Application

This is a comprehensive teacher assistant application with AI integration, built with React, TypeScript, and Vite for the frontend, and Node.js, Express, and MongoDB for the backend.

## Features

- **Google Authentication** - Secure login with Google accounts
- **Classroom Management** - Create and manage multiple classrooms
- **Student Tracking** - Monitor attendance and participation
- **Lesson Planning** - AI-powered lesson plan generation
- **Assessment Tools** - Quiz creation and grade tracking
- **Dashboard Views** - Visual overview of class statistics
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Google Generative AI** - AI integration

### Backend
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

## Setup Instructions

### Frontend

1. **Install dependencies:**
   ```bash
   cd asistenguruv3
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the asistenguruv3 directory with the following variables:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

### Backend

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

## Development

To run both frontend and backend in development mode:

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd asistenguruv3
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Deployment

### Frontend
The frontend can be deployed to any static hosting service like:
- Vercel
- Netlify
- GitHub Pages

### Backend
The backend can be deployed to any Node.js hosting platform like:
- Heroku
- Render
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Google Cloud Run

Make sure to set the environment variables in your deployment platform.

## API Documentation

For detailed API documentation, please refer to the [backend README](../backend/README.md).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
