// src/pages/SettingsPage.jsx
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>
      {/* Settings content will go here */}
    </div>
  );
};

export default SettingsPage;