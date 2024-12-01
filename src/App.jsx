// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { AuthProvider } from './context/AuthContext';

// Import your page components
const DashboardPage = () => <div>Dashboard Content</div>; // Placeholder
const PatientsPage = () => <div>Patients Content</div>; // Placeholder
const DiagnosticsPage = () => <div>Diagnostics Content</div>; // Placeholder
const SandboxPage = () => <div>Sandbox Content</div>; // Placeholder

function App() {
  return (
    <Router>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/diagnostics" element={<DiagnosticsPage />} />
            <Route path="/sandbox" element={<SandboxPage />} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;