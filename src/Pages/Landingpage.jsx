
import React from 'react';
import Footer from '../Components/common/Footer';
import LoginForm from '../Components/Auth/loginform';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent animate-gradient">
            HAIDAA
          </h1>
          <h2 className="text-xl mt-4 text-gray-600 font-light">
            Your AI-powered Healthcare Assistant
          </h2>
          <p className="mt-2 text-gray-500 max-w-2xl mx-auto">
            Empowering healthcare professionals with advanced AI diagnostics and seamless patient management
          </p>
        </header>

        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <LoginForm />
          </div>
        </div>

        <div className="mt-12">
          <Footer className="bg-transparent" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
