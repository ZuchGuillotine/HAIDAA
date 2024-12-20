// src/Pages/LandingPage.jsx
import React from 'react';
import Footer from '../Components/common/Footer';
import LoginForm from '../Components/Auth/loginform';

const LandingPage = () => {
  return (
    <div style={{
      backgroundColor: '#f0f0f0', // Light grey background
      color: '#89CFF0', // White text
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
    }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '4rem', margin: 0 }}>HAIDAA</h1>
        <h2 style={{ fontSize: '1.5rem', marginTop: '10px', color: '#cccccc' }}>
          Your AI-powered Resident
        </h2>
      </header>

      <div
        style={{
          backgroundColor: '#add8e6', // Light blue background
          borderRadius: '10px',
          padding: '20px 40px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <LoginForm />
      </div>

      <Footer style={{ marginTop: '40px' }} />
    </div>
  );
};

export default LandingPage;
