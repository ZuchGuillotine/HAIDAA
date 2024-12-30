// Frontend: src/services/authService.js
class AuthService {
  constructor(baseUrl = '/api/auth') {
    this.baseUrl = baseUrl;
  }

  async signup(email, password, role) {
    try {
      const response = await fetch(`${this.baseUrl}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      throw new Error(error.message || 'Signup failed');
    }
  }

  async login(email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('Failed to parse response:', text);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return {
        user: data.user,
        mfaRequired: data.mfaRequired,
        token: data.token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  }

  async verifyMFA(userId, token) {
    try {
      const response = await fetch(`${this.baseUrl}/verify-mfa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId, token }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'MFA verification failed');
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      throw new Error(error.message || 'MFA verification failed');
    }
  }

  logout() {
    localStorage.removeItem('token');
  }
}

export default new AuthService();