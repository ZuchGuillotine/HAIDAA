// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from "./Pages/Landingpage.jsx";
import MainLayout from "./Components/layout/MainLayout";
import { useAuth } from "./Context/AuthContext";

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Placeholder for a loading spinner
  }

  return (
    <Router>
      <Routes>
        {/* Landing Page (Public Route) */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/MainLayout" replace /> : <LandingPage />
          }
        />

        {/* Authenticated Routes */}
        <Route
          path="/MainLayout" // Fixed to use the correct route path
          element={
            isAuthenticated ? <MainLayout /> : <Navigate to="/" replace />
          }
        />

        {/* Additional authenticated or public routes can go here */}
      </Routes>
    </Router>
  );
};

export default App;