import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Activate from './pages/Activate';
import Courses from './pages/Courses';
import Header from './components/Header';
import Footer from './components/Footer';
import { MantineProvider } from '@mantine/core';
import VideoPage from './pages/VideoPage';
import Hero from './components/Hero';
import CourseUploadForm from './pages/CourseUploadForm';
import ProtectedRoute from './components/ProtectedRoute';
import Catalog from './pages/Catalog';
import useUserStore from './store/useUserStore';
import { Navigate } from 'react-router-dom';
import AdminHomePage from './pages/AdminHomePage';
const App = () => {
  const user = useUserStore((state)=> state.user)
  return (
    <MantineProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/uploadCourse" element={
                <ProtectedRoute
                element={CourseUploadForm}
                requiredRole="admin"
                redirectPath="/"
              />
              } />

              <Route path="/" element={
                user?(
                  user.role === "admin" ? (
                    <AdminHomePage/>
                  ):(
                    <Hero/>
                  )
                ):(
                  <Hero></Hero>
                )
              } />

              <Route path="/watch" element={<VideoPage/>} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login/>} />
              <Route path="/activate" element={<Activate />} />

              <Route path="/courses" element={
                <ProtectedRoute
                  element={Courses}
                  requiredRole="user"
                  redirectPath="/"
                />
              } />

              <Route path="/catalog" element={
                <ProtectedRoute
                  element={Catalog}
                  requiredRole="user"
                  redirectPath="/"
                />
              } />

            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </MantineProvider>
  );
};

export default App;