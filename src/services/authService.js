
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

class AuthService {
  static async signup(email, password, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role';
    const values = [email, hashedPassword, role];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async login(email, password) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }
}

module.exports = AuthService;
