// frontend/src/services/authService.js
class AuthService {
  constructor() {
    // Get the base URL from the current window location
    const host = window.location.hostname;
    // Use the Replit-specific domain but with port 3000
    this.baseUrl = `https://${host}:3000/api/auth`;
    console.log('AuthService initialized with baseUrl:', this.baseUrl);
  }

  async login(email, password) {
    try {
      const loginUrl = `${this.baseUrl}/login`;
      console.log('Attempting login request to:', loginUrl);

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message;
        } catch {
          errorMessage = 'Login failed';
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Login successful, received data:', { ...data, token: data.token ? '[HIDDEN]' : undefined });

      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        url: loginUrl,
      });
      throw error;
    }
  }
}

export default new AuthService();