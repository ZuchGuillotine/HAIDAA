// src/components/doctor/__tests__/PatientSearchList.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PatientSearchList } from '../PatientSearchList';

const mockPatients = [
  {
    id: '1',
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    condition: 'Hypertension',
    riskLevel: 'Medium',
  },
  {
    id: '2',
    name: 'Jane Doe',
    age: 32,
    gender: 'Female',
    condition: 'Diabetes',
    riskLevel: 'High',
  },
];

describe('PatientSearchList', () => {
  test('renders patient list correctly', () => {
    render(
      <BrowserRouter>
        <PatientSearchList />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/search patients/i)).toBeInTheDocument();
    mockPatients.forEach(patient => {
      expect(screen.getByText(patient.name)).toBeInTheDocument();
    });
  });

  test('filters patients by search term', async () => {
    render(
      <BrowserRouter>
        <PatientSearchList />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search patients/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
    });
  });

  test('shows no results message when no patients match search', async () => {
    render(
      <BrowserRouter>
        <PatientSearchList />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search patients/i);
    fireEvent.change(searchInput, { target: { value: 'NonexistentPatient' } });

    await waitFor(() => {
      expect(screen.getByText(/no patients found/i)).toBeInTheDocument();
    });
  });
});