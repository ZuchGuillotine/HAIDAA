
import React from 'react';
import Footer from '../Components/common/Footer';
import LoginForm from '../Components/Auth/loginform';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="text-center mb-10">
        <h1 className="text-6xl text-[#89CFF0] m-0">HAIDAA</h1>
        <h2 className="text-xl mt-2 text-gray-400">
          your AI-powered resident
        </h2>
      </header>

      <LoginForm />

      <Footer className="mt-10" />
    </div>
  );
};

export default LandingPage;
