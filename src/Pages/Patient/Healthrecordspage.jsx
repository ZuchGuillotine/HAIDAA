// src/pages/patient/HealthRecordsPage.jsx
import React from 'react';
import HealthRecordsList from '../../components/patient/HealthRecordsList';

const HealthRecordsPage = () => {
  return (
    <div className="health-records-page">
      <h1>Your Health Records</h1>
      <HealthRecordsList />
    </div>
  );
};

export default HealthRecordsPage;
