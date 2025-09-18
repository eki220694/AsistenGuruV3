# Gmail Authentication Implementation Guide

This document explains how to implement Gmail authentication in the Asisten Guru application.

## Overview

The application uses Google OAuth 2.0 for authentication, allowing teachers to sign in with their Gmail accounts. The authentication flow involves:

1. Frontend initiates Google OAuth flow
2. User authenticates with Google
3. Google returns an ID token
4. Frontend sends token to backend
5. Backend verifies token with Google
6. Backend creates/updates user and returns JWT
7. Frontend stores JWT for future API requests

## Frontend Implementation

### 1. Google OAuth Client Setup

1. Create a project in the Google Cloud Console
2. Enable the Google+ API
3. Create OAuth 2.0 credentials (Web application type)
4. Add authorized JavaScript origins:
   - http://localhost:3000 (for development)
   - Your production domain (e.g., https://your-app.com)

### 2. Install Google Identity Services

Add the Google Identity Services script to your `index.html`:

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### 3. Initialize Google Auth

In your LoginView component, initialize Google Auth:

```javascript
useEffect(() => {
  /* global google */
  if (window.google) {
    google.accounts.id.initialize({
      client_id: process.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleSignIn,
    });
    
    google.accounts.id.renderButton(
      document.getElementById("googleSignInButton"),
      { theme: "outline", size: "large" }
    );
  }
}, []);

const handleGoogleSignIn = async (response) => {
  try {
    // Send the ID token to your backend
    const result = await googleLogin(response.credential);
    
    // Store the JWT token
    setAuthToken(result.token);
    
    // Update auth context
    login(result.teacher);
  } catch (error) {
    console.error('Google sign in failed:', error);
  }
};
```

## Backend Implementation

### 1. Environment Variables

Set up these environment variables in your backend:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
JWT_SECRET=your_jwt_secret_here
```

### 2. Token Verification

The backend verifies the Google ID token using the Google Auth library:

```javascript
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (error) {
    throw new Error('Invalid Google token');
  }
};
```

### 3. User Creation/Update

After verifying the token, the backend either finds an existing user or creates a new one:

```javascript
const findOrCreateTeacher = async (payload) => {
  const { sub: googleId, name, email, picture: avatar } = payload;
  
  let teacher = await Teacher.findOne({ email });
  
  if (teacher) {
    // Update teacher info if needed
    teacher.googleId = googleId;
    teacher.name = name;
    teacher.avatar = avatar;
    await teacher.save();
  } else {
    // Create new teacher
    teacher = await Teacher.create({
      googleId,
      name,
      email,
      avatar,
    });
  }
  
  return teacher;
};
```

### 4. JWT Generation

After creating/updating the user, generate a JWT for future authentication:

```javascript
const jwt = require('jsonwebtoken');

const generateToken = (teacherId) => {
  return jwt.sign({ id: teacherId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
```

## Security Considerations

1. Always verify ID tokens on the backend
2. Use HTTPS in production
3. Store JWT tokens securely (HttpOnly cookies or secure localStorage)
4. Implement proper token expiration and refresh mechanisms
5. Validate user permissions for all API endpoints

## Testing

For development, you can test the authentication flow using:
1. Google's OAuth 2.0 Playground
2. Creating test accounts in the Google Cloud Console
3. Using localhost as an authorized domain

## Error Handling

Common errors to handle:
1. Invalid Google tokens
2. Network errors during verification
3. Database errors when creating/updating users
4. Expired or malformed JWT tokens

Implement appropriate error messages and retry mechanisms for a smooth user experience.