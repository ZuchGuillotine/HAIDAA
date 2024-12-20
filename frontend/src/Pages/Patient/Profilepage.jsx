// src/pages/patient/ProfilePage.jsx
import React, { useState, useEffect } from 'react';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    // Other fields
  });

  useEffect(() => {
    // Fetch profile data from the API
    // setProfile(response.data);
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send updated profile data to the API
  };

  return (
    <div className="profile-page">
      <h1>Update Personal Information</h1>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            name="firstName"
            value={profile.firstName}
            onChange={handleChange}
          />
        </label>
        <label>
          Last Name:
          <input
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            name="email"
            value={profile.email}
            onChange={handleChange}
            type="email"
          />
        </label>
        <label>
          Phone Number:
          <input
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleChange}
            type="tel"
          />
        </label>
        {/* Other fields */}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default ProfilePage;
