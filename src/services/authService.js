
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import pool from '../database/db';

class AuthService {
  static async signup(email, password, role) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const mfaSecret = speakeasy.generateSecret().base32;
      
      const query = `
        INSERT INTO users (email, password_hash, role, mfa_secret)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, role`;
      const values = [email, hashedPassword, role, mfaSecret];
      
      const result = await client.query(query, values);
      await client.query('COMMIT');
      
      return { ...result.rows[0], mfaSecret };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async login(email, password) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];

      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        throw new Error('Invalid credentials');
      }

      return {
        user: { id: user.id, email: user.email, role: user.role },
        mfaRequired: true,
        mfaSecret: user.mfa_secret
      };
    } finally {
      client.release();
    }
  }

  static async verifyMFA(userId, token) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT mfa_secret FROM users WHERE id = $1', [userId]);
      const user = result.rows[0];

      const verified = speakeasy.totp.verify({
        secret: user.mfa_secret,
        encoding: 'base32',
        token: token
      });

      if (!verified) {
        throw new Error('Invalid MFA token');
      }

      return jwt.sign(
        { userId, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
    } finally {
      client.release();
    }
  }
}

export default AuthService;
