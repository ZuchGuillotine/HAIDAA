// src/components/patient/HealthRecordsList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const HealthRecordsList = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // Fetch health records from the API
    // setRecords(response.data);
  }, []);

  return (
    <div className="health-records-list">
      {records.length > 0 ? (
        <ul>
          {records.map((record) => (
            <li key={record.id}>
              <Link to={`/patient/health-records/${record.id}`}>
                {record.title} - {record.date}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No health records found.</p>
      )}
    </div>
  );
};

export default HealthRecordsList;
