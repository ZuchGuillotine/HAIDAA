// src/services/authService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

class AuthService {
  async login(email, password) {
    const client = await pool.connect();
    console.log('Login attempt for:', email);

    try {
      const result = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      console.log('Database query result:', result.rows);

      const user = result.rows[0];
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        throw new Error('Invalid credentials');
      }

      const tempToken = jwt.sign(
        { 
          userId: user.id, 
          role: user.role,
          mfaPending: true 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '5m' }
      );

      await client.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          lastLogin: user.last_login
        },
        mfaRequired: true,
        token: tempToken
      };
    } catch (error) {
      console.error('Login error in service:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // ... other methods remain the same ...
}

export default new AuthService();