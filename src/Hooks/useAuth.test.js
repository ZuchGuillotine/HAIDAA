// src/hooks/__tests__/useAuth.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '../useAuth';
import { AuthProvider } from '@/context/AuthContext';

const wrapper = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  test('provides authentication state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  test('handles login successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        email: 'doctor@example.com',
        password: 'password123'
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeTruthy();
  });

  test('handles logout', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });
});

// src/hooks/__tests__/usePatientData.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import { usePatientData } from '../usePatientData';

describe('usePatientData', () => {
  test('fetches patient list', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePatientData());

    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.patients).toHaveLength(2);
  });

  test('fetches single patient data', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      usePatientData('1')
    );

    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.currentPatient).toBeTruthy();
    expect(result.current.currentPatient.id).toBe('1');
  });
});