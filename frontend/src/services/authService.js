const API_URL = 'http://0.0.0.0:3000/api/auth';

const authService = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed'); //Retains original error handling for more info.
      }

      return await response.json();
    } catch (error) {
      console.error('Login error:', error); //Retains original logging
      throw new Error(error.message || 'Login failed'); //Retains original error handling
    }
  }
};

export default authService;