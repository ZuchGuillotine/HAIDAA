// frontend/src/services/authService.js
class AuthService {
  constructor() {
    // Get the current origin (includes protocol, hostname, and port)
    this.baseUrl = `${window.location.origin}/api/auth`;
    console.log('API URL:', this.baseUrl);
  }

  async login(email, password) {
    try {
      console.log('Attempting login...');
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Login successful');

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