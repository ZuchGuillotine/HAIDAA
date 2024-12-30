// frontend/src/services/authService.js
class AuthService {
  constructor() {
    // Use the current window location
    const host = window.location.hostname;
    // Don't include the port if it's 3003 (Vite dev server)
    const port = window.location.port === '3003' ? '3000' : window.location.port;
    this.baseUrl = `https://${host}:${port}/api/auth`;
    console.log('Initialized AuthService with baseUrl:', this.baseUrl);
  }

  async login(email, password) {
    try {
      const loginUrl = `${this.baseUrl}/login`;
      console.log('Making login request to:', loginUrl);
      console.log('Request payload:', { email, password: '****' });

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      console.log('Response status:', response.status);

      // Try to get response text first
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        throw new Error(responseText || 'Login failed');
      }

      // Parse the response text if it exists
      const data = responseText ? JSON.parse(responseText) : {};

      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        url: this.baseUrl,
        error
      });
      throw error;
    }
  }
}

export default new AuthService();