// src/pages/Doctor/PatientsPage.jsx
import React from 'react';
import { PatientSearchList } from '@/components/patient';

const PatientsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
        <p className="text-gray-600">View and manage your patients</p>
      </div>
      <PatientSearchList />
    </div>
  );
};

export default PatientsPage;