// src/pages/Auth/LoginPage.jsx
import React from 'react';
import { LoginForm } from '@/components/auth';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <LoginForm />
    </div>
  );
};

export default LoginPage;