import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '@fortawesome/fontawesome-free/css/all.min.css';
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import Hero from './components/Hero.jsx'
import HomeRedirect from './components/HomeRedirect.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminHomePage from './pages/AdminHomePage.jsx'
import Login from './pages/Login.jsx'
import Catalog from './pages/Catalog.jsx'
import Courses from './pages/Courses.jsx'
import Register from './pages/Register.jsx'
import Activate from './pages/Activate.jsx'
import VideoPage from './pages/VideoPage.jsx'
import CourseUploadForm from './pages/CourseUploadForm.jsx'

const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {
        index:true,
        element:<HomeRedirect/>
      },
      {
        path:'admin',
        element:(
          <ProtectedRoute element={AdminHomePage} requiredRole="admin" redirectPath='/'>
          </ProtectedRoute>
        )
      },
      {
        path:"login",
        element:<Login/>
      },
      {
        path:"catalog",
        element:(
          <ProtectedRoute element={Catalog} requiredRole="user" redirectPath='/'/>
        )
      },
      {
        path:"My-courses",
        element:(
          <ProtectedRoute element={Courses} requiredRole="user" redirectPath='/'/>
        )
      },
      {
        path:"register",
        element:<Register/>
      },
      {
        path:"activate",
        element:<Activate/>
      },
      {
        path:"courses/:courseId/watch/:videoId",
        element:<VideoPage/>
      },
      {
        path:"uploadCourse",
        element:(
          <ProtectedRoute element={CourseUploadForm} requiredRole="admin" redirectPath=''/>
        )
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router = {appRouter}>

  </RouterProvider>
)
