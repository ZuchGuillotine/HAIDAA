
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from "./Pages/Landingpage.jsx";
import MainLayout from "./Components/layout/MainLayout";
import { LoadingSpinner } from "./Components/common";
import { useAuth } from "./Context/AuthContext";
import RegisterPage from "./Pages/Auth/RegisterPage";
import LoginPage from "./Pages/Auth/LoginPage";

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <MainLayout /> : <LandingPage />}
      />
    </Routes>
  );
};

export default App;
