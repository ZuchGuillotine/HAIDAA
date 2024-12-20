// src/pages/Doctor/DiagnosticsPage.jsx
import React from 'react';
import { AIDiagnosticInterface } from '@/components/ai';

const DiagnosticsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Diagnostics</h1>
        <p className="text-gray-600">Get AI-powered diagnostic assistance</p>
      </div>
      <AIDiagnosticInterface />
    </div>
  );
};

export default DiagnosticsPage;