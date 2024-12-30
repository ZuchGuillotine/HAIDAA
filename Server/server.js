
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/authroutes');

const app = express();

// Middleware
app.use(cors({
  origin: [`${process.env.FRONTEND_URL || 'http://localhost:5173'}`, 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(bodyParser.json());

// Mount Routes
app.use('/api/auth', authRoutes);

// Default Error Handling
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
