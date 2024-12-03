// src/pages/Doctor/SandboxPage.jsx
import React from 'react';
import { SandboxEnvironment } from '@/components/sandbox';

const SandboxPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Training Sandbox</h1>
        <p className="text-gray-600">Practice with AI diagnostic tools using simulated cases</p>
      </div>
      <SandboxEnvironment />
    </div>
  );
};

export default SandboxPage;