// src/pages/Doctor/PatientDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { usePatientData } from '@/hooks/usePatientData';

const PatientDetailPage = () => {
  const { id } = useParams();
  const { currentPatient, loading, error } = usePatientData(id);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentPatient) return <div>Patient not found</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{currentPatient.name}</h1>
        <p className="text-gray-600">Patient Details</p>
      </div>
      {/* Patient details content will go here */}
    </div>
  );
};

export default PatientDetailPage;