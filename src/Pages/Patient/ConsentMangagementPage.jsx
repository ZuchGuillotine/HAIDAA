// src/pages/patient/ConsentManagementPage.jsx
import React from 'react';
import ConsentManagement from '../../components/patient/ConsentManagement';

const ConsentManagementPage = () => {
  return (
    <div className="consent-management-page">
      <h1>Manage Your Consents</h1>
      <ConsentManagement />
    </div>
  );
};

export default ConsentManagementPage;
