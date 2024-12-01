// src/hooks/usePatientData.js
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const usePatientData = (patientId = null) => {
  const [patients, setPatients] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Mock API calls - replace with real API calls in production
  const fetchPatients = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const response = await new Promise(resolve => setTimeout(() => resolve([
        { id: 1, name: 'John Doe', age: 45, condition: 'Hypertension' },
        { id: 2, name: 'Jane Smith', age: 32, condition: 'Diabetes' }
      ]), 1000));
      setPatients(response);
    } catch (err) {
      setError('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientById = async (id) => {
    setLoading(true);
    try {
      // Simulate API call
      const response = await new Promise(resolve => 
        setTimeout(() => resolve({
          id: id,
          name: 'John Doe',
          age: 45,
          condition: 'Hypertension',
          history: [],
          medications: []
        }), 1000)
      );
      setCurrentPatient(response);
    } catch (err) {
      setError(`Failed to fetch patient with ID: ${id}`);
    } finally {
      setLoading(false);
    }
  };

  const updatePatient = async (patientId, data) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Update local state
      setPatients(prevPatients => 
        prevPatients.map(p => 
          p.id === patientId ? { ...p, ...data } : p
        )
      );
      if (currentPatient?.id === patientId) {
        setCurrentPatient(prev => ({ ...prev, ...data }));
      }
      return true;
    } catch (err) {
      setError('Failed to update patient');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!patientId) {
      fetchPatients();
    } else {
      fetchPatientById(patientId);
    }
  }, [patientId]);

  return {
    patients,
    currentPatient,
    loading,
    error,
    fetchPatients,
    fetchPatientById,
    updatePatient,
    setError
  };
};