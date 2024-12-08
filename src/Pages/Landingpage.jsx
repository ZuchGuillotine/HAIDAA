// src/Pages/LandingPage.jsx
import React from 'react';
import Footer from '../Components/common/Footer';
import { Link } from 'react-router-dom';

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
          your AI-powered resident
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
        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '1rem',
              }}
            />
          </div>
          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '1rem',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/signup" style={{ textDecoration: 'none', color: '#007bff' }}>
              Sign Up
            </Link>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#007bff',
                color: '#fff',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Login
            </button>
          </div>
        </form>
      </div>

      <Footer style={{ marginTop: '40px' }} />
    </div>
  );
};

export default LandingPage;
