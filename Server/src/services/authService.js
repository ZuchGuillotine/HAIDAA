
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

class AuthService {
  async register(email, password) {
    const client = await pool.connect();
    console.log('Registration attempt for:', email);

    try {
      // Check if user exists
      const existingUser = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('User already exists');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert new user
      const result = await client.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, role',
        [email, hashedPassword]
      );

      const user = result.rows[0];
      console.log('User registered successfully:', user.email);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async login(email, password) {
    const client = await pool.connect();
    console.log('Login attempt for:', email);

    try {
      const result = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      const user = result.rows[0];
      if (!user) {
        console.log('User not found:', email);
        throw new Error('Invalid credentials');
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        console.log('Invalid password for user:', email);
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { 
          userId: user.id, 
          role: user.role,
          email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      console.log('Login successful for:', email);
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new AuthService();
