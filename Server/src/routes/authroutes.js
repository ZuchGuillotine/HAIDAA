// Backend: server/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

router.post('/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const result = await authService.signup(email, password, role);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

router.post('/verify-mfa', async (req, res) => {
  try {
    const { userId, token } = req.body;
    const result = await authService.verifyMFA(userId, token);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = router;