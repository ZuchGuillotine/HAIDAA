// src/components/patient/ProfileSummary.jsx
import React from 'react';

const ProfileSummary = () => {
  // Fetch profile data using a custom hook or context
  return (
    <div className="profile-summary">
      <h2>Profile Summary</h2>
      <p>Name: [Patient Name]</p>
      <p>Email: [Patient Email]</p>
      {/* Other summary details */}
    </div>
  );
};

export default ProfileSummary;
