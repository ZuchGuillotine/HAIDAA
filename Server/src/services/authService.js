// Backend: server/src/services/authService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const pool = require('../database/db');

class AuthService {
  async signup(email, password, role) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check for existing user
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length) {
        throw new Error('User already exists');
      }

      // Create new user with MFA
      const hashedPassword = await bcrypt.hash(password, 10);
      const mfaSecret = speakeasy.generateSecret().base32;

      const query = `
        INSERT INTO users (email, password_hash, role, mfa_secret, created_at, updated_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, email, role, created_at`;
      const values = [email, hashedPassword, role, mfaSecret];

      const result = await client.query(query, values);
      await client.query('COMMIT');

      // Generate initial token for the new user
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

  async login(email, password) {
    const client = await pool.connect();
    try {
      // Get user with password hash and MFA secret
      const result = await client.query(
        'SELECT id, email, role, password_hash, mfa_secret, last_login FROM users WHERE email = $1',
        [email]
      );

      const user = result.rows[0];

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        throw new Error('Invalid credentials');
      }

      // Generate temporary token for MFA process
      const tempToken = jwt.sign(
        { 
          userId: user.id, 
          role: user.role,
          mfaPending: true 
        },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
      );

      // Update last login timestamp
      await client.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      return {
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
      throw error;
    } finally {
      client.release();
    }
  }

  async verifyMFA(userId, token) {
    const client = await pool.connect();
    try {
      // Get user MFA secret
      const result = await client.query(
        'SELECT id, email, role, mfa_secret FROM users WHERE id = $1',
        [userId]
      );

      const user = result.rows[0];
      if (!user) {
        throw new Error('User not found');
      }

      // Verify MFA token
      const verified = speakeasy.totp.verify({
        secret: user.mfa_secret,
        encoding: 'base32',
        token: token,
        window: 1 // Allows for 30 seconds of time drift
      });

      if (!verified) {
        throw new Error('Invalid MFA token');
      }

      // Generate full access token after successful MFA
      const accessToken = jwt.sign(
        {
          userId: user.id,
          role: user.role,
          mfaVerified: true
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Update MFA verification timestamp
      await client.query(
        'UPDATE users SET last_mfa_verify = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      return {
        token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  async refreshToken(userId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, email, role FROM users WHERE id = $1',
        [userId]
      );

      const user = result.rows[0];
      if (!user) {
        throw new Error('User not found');
      }

      return jwt.sign(
        {
          userId: user.id,
          role: user.role,
          mfaVerified: true
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
    } finally {
      client.release();
    }
  }
}

module.exports = new AuthService();