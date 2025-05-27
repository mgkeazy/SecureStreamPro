# Learning Management System (LMS)
This is a full-stack Learning Management System with user authentication, course management, video content delivery, and enrollment features.

## Project Overview

The LMS consists of two main components:
- **Frontend**: React application built with Vite
- **Backend**: Node.js/Express API with MongoDB database

### Features

- **User Authentication**: Registration, login, and role-based access control
- **Course Management**: Create, view, and manage courses
- **Video Content**: Secure video delivery using VdoCipher
- **Enrollment System**: Users can enroll in courses
- **Admin Dashboard**: Course upload and management for administrators
- **Responsive UI**: Built with Chakra UI, Mantine, and TailwindCSS

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image and file storage)
- VdoCipher account (for video hosting)
- SMTP email service (for sending activation emails)
- Redis (optional, for caching)

## Installation

### Backend Setup

1. Navigate to the server directory:
cd server

2. Install dependencies:
npm install

3. Create a `.env` file in the server directory with the following variables:
```
# Server Configuration
PORT=5000
ORIGIN=http://localhost:5173  # Frontend URL

# Database
DB_URI=mongodb://localhost:27017/lms  # or your MongoDB Atlas URI

# JWT Authentication
ACCESS_TOKEN=your_access_token_secret
REFRESH_TOKEN=your_refresh_token_secret
ACCESS_TOKEN_EXPIRE=300  # in seconds
REFRESH_TOKEN_EXPIRE=1200  # in seconds
ACTIVATION_SECRET=your_activation_secret

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_SCRET_KEY=your_cloudinary_secret_key

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SERVICE=gmail  # or your email service
SMTP_MAIL=your_email@example.com
SMTP_PASSWORD=your_email_password

# VdoCipher Configuration

VDOCIPHER_API_SECRET=your_vdocipher_api_secret (For getting this api secret you have to create a account on vdocipher and make a secret key there)

# Redis (Optional)
REDIS_URL=redis://localhost:6379
```

### Frontend Setup

1. Navigate to the frontend directory:
cd my-auth-app

2. Install dependencies:
npm install

3. Create a `.env` file in the my-auth-app directory with the following variables:
VITE_BACKEND_URL=http://localhost:5000/api/v1


## Running the Application

### Start the Backend Server

cd server
npm run dev

The server will start on the port specified in your .env file (default: 5000).

### Start the Frontend Development Server

cd my-auth-app
npm run dev

The frontend development server will start on http://localhost:5173.

## Usage Guide

### User Registration and Login
1. Navigate to the registration page at `/register`
2. Fill in your details and submit the form
3. Check your email for an activation link
4. Click the activation link to activate your account
5. Log in with your credentials at `/login`


### Admin Registration
1. For Admin registration you have to create a manual entry in mongodb atlas with role as admin

### Browsing Courses (User)

1. After logging in, you'll be redirected to the catalog page
2. Browse available courses
3. Click on a course to view details
4. Enroll in courses that interest you

### Accessing Your Courses (User)

1. Navigate to "My Courses" in the navigation menu
2. View all courses you're enrolled in
3. Click on a course to access its content
4. Watch videos and complete assignments

### Course Management (Admin)

1. Log in with an admin account
2. Navigate to the admin dashboard
3. Upload new courses using the course upload form (While uploading form you have to write videoId manually as you can't upload video here, for doing this upload video in vdocipher manually and copy paste video id here)


## API Documentation

The backend API is organized under the `/api/v1` prefix with the following routes:

- **User Routes**: Authentication and user management
  - POST `/register`: Register a new user
  - POST `/activate`: Activate a user account
  - POST `/login`: User login
  - GET `/logout`: User logout
  - GET `/refresh`: Refresh access token
  - GET `/me`: Get current user profile

- **Course Routes**: Course management
  - POST `/create-course`: Create a new course (admin only)
  - GET `/get-courses`: Get all courses
  - GET `/get-course/:id`: Get a specific course
  - PUT `/update-course/:id`: Update a course (admin only)
  - DELETE `/delete-course/:id`: Delete a course (admin only)

- **Enrollment Routes**: Course enrollment
  - POST `/enroll`: Enroll in a course
  - GET `/my-enrollments`: Get user's enrollments
  - GET `/course-enrollments/:courseId`: Get enrollments for a course (admin only)

- **Video Routes**: Video content management
  - POST `/create-video`: Create a video (admin only)
  - GET `/get-video/:id`: Get video details
  - PUT `/update-video/:id`: Update video details (admin only)
  - DELETE `/delete-video/:id`: Delete a video (admin only)

## Troubleshooting

- **Connection Issues**: Ensure MongoDB is running and the connection string is correct and our college wifi doesnt support MongoDB Atlas so you have to use Cloudflare or VPN
- **Email Sending Fails**: Verify SMTP settings and credentials
- **Video Playback Issues**: Check VdoCipher configuration and API keys
- **CORS Errors**: Ensure the ORIGIN environment variable matches your frontend URL

## License

This project is licensed under the ISC License.

## Author

Khushal Kumawat