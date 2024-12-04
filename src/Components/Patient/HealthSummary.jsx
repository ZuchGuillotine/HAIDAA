// src/components/patient/HealthSummary.jsx
import React from 'react';

const HealthSummary = () => {
  // Fetch recent health records or updates
  return (
    <div className="health-summary">
      <h2>Recent Health Updates</h2>
      <ul>
        <li>Record 1: Description...</li>
        <li>Record 2: Description...</li>
        {/* Map through recent records */}
      </ul>
    </div>
  );
};

export default HealthSummary;
