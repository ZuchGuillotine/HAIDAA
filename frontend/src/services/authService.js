// frontend/src/services/authService.js
class AuthService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';
  }

  async login(email, password) {
    try {
      console.log('Attempting login for:', email);
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'An error occurred during login'
        }));
        throw new Error(errorData.message);
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
}

export default new AuthService();