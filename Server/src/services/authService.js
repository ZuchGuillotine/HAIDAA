
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import pool from '../database/db.js';

class AuthService {
  async signup(email, password, role) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const mfaSecret = speakeasy.generateSecret().base32;

      const query = `
        INSERT INTO users (email, password_hash, role, mfa_secret, created_at, updated_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, email, role, created_at`;
      const values = [email, hashedPassword, role, mfaSecret];

      const result = await client.query(query, values);
      await client.query('COMMIT');

      const token = jwt.sign(
        { userId: result.rows[0].id, role: role, mfaPending: true },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
      );

      return {
        user: result.rows[0],
        mfaSecret,
        token,
        mfaRequired: true
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // ... rest of the methods remain the same ...
}

export default new AuthService();
