// src/components/patient/ConsentManagement.jsx
import React, { useEffect, useState } from 'react';

const ConsentManagement = () => {
  const [consents, setConsents] = useState([]);

  useEffect(() => {
    // Fetch current consents from the API
    // setConsents(response.data);
  }, []);

  const handleToggleConsent = (consentId) => {
    // Toggle consent status and update via API
    // Update state accordingly
  };

  return (
    <div className="consent-management">
      {consents.length > 0 ? (
        <ul>
          {consents.map((consent) => (
            <li key={consent.id}>
              <p>{consent.description}</p>
              <button onClick={() => handleToggleConsent(consent.id)}>
                {consent.isActive ? 'Revoke Consent' : 'Grant Consent'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No consents found.</p>
      )}
    </div>
  );
};

export default ConsentManagement;
