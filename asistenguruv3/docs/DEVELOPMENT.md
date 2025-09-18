# Development Setup Guide

This guide explains how to set up the development environment for the Asisten Guru application.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher) or yarn
- MongoDB (local installation or cloud instance)
- Git

## Project Structure

The project consists of two main parts:
1. `asistenguruv3/` - Frontend application
2. `backend/` - Backend API server

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AsistenGuruV3
```

### 2. Install Dependencies

You can install all dependencies with one command:

```bash
npm run install:all
```

Or install them separately:

#### Frontend
```bash
cd asistenguruv3
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 3. Configure Environment Variables

#### Frontend Environment Variables
Create a `.env` file in the `asistenguruv3/` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

#### Backend Environment Variables
Create a `.env` file in the `backend/` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/asistenguru
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Set up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials:
   - Type: Web application
   - Authorized JavaScript origins:
     - http://localhost:3000 (for development)
   - Authorized redirect URIs:
     - http://localhost:3000 (for development)
5. Copy the Client ID and Client Secret to your environment variables

### 5. Set up Google Generative AI

1. Go to the [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Copy the API key to your environment variables

### 6. Start MongoDB

If you're using a local MongoDB installation:

```bash
mongod
```

Or use a cloud MongoDB service like MongoDB Atlas.

### 7. Run the Application

#### Run Both Frontend and Backend
```bash
npm run dev
```

This will start both the backend server (on port 5000) and the frontend development server (on port 3000).

#### Run Separately

##### Backend
```bash
cd backend
npm run dev
```

##### Frontend
```bash
cd asistenguruv3
npm run dev
```

### 8. Access the Application

Open your browser and navigate to:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Development Workflow

### Frontend Development

The frontend uses Vite as the build tool with Hot Module Replacement (HMR) enabled. Changes to the code will automatically refresh the browser.

Key technologies:
- React with TypeScript
- Tailwind CSS for styling
- Axios for HTTP requests
- Google Generative AI for AI features

### Backend Development

The backend uses Node.js with Express and MongoDB with Mongoose.

Key features:
- RESTful API design
- JWT-based authentication
- MongoDB for data storage
- Google OAuth for user authentication
- Google Generative AI for AI features

## Testing

### Frontend Testing

Currently, the application doesn't have a test suite. To add tests:

1. Install testing libraries:
   ```bash
   cd asistenguruv3
   npm install --save-dev @testing-library/react @testing-library/jest-dom jest
   ```

2. Create test files with `.test.tsx` extension

3. Run tests:
   ```bash
   npm test
   ```

### Backend Testing

To add backend tests:

1. Install testing libraries:
   ```bash
   cd backend
   npm install --save-dev jest supertest
   ```

2. Create test files with `.test.js` extension

3. Run tests:
   ```bash
   npm test
   ```

## Code Quality

### Linting

The project uses ESLint for code quality and formatting:

```bash
# Frontend
cd asistenguruv3
npm run lint

# Backend
cd backend
npm run lint
```

### Formatting

The project uses Prettier for code formatting:

```bash
# Frontend
cd asistenguruv3
npm run format

# Backend
cd backend
npm run format
```

## Debugging

### Frontend Debugging

1. Use browser developer tools
2. Check the console for errors
3. Use React Developer Tools browser extension

### Backend Debugging

1. Check the terminal for server logs
2. Use console.log statements for debugging
3. Consider using a debugger like ndb or VS Code debugger

## Common Issues

### Port Conflicts

If port 3000 or 5000 is already in use:

1. Change the port in the respective configuration files
2. Or kill the process using the port:
   ```bash
   # Linux/Mac
   lsof -i :3000
   kill -9 <PID>
   
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

### MongoDB Connection Issues

1. Ensure MongoDB is running
2. Check the MONGODB_URI in your backend .env file
3. Verify network connectivity to your MongoDB instance

### Google OAuth Issues

1. Ensure your Google OAuth credentials are correct
2. Check that the authorized origins and redirect URIs match your setup
3. Verify that the Google+ API is enabled in the Google Cloud Console

### AI API Issues

1. Ensure your Gemini API key is correct
2. Check that you haven't exceeded your API quota
3. Verify network connectivity to the Google AI services

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests if applicable
5. Run the linter and fix any issues
6. Commit your changes
7. Push to your fork
8. Create a pull request

## Deployment

For deployment instructions, please refer to the individual README files:
- [Frontend README](../asistenguruv3/README.md)
- [Backend README](../backend/README.md)