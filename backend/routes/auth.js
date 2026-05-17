const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const AUTH_FILE = path.join(__dirname, '../data/auth.json');

function readAuth() {
  return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
}

function writeAuth(data) {
  fs.writeFileSync(AUTH_FILE, JSON.stringify(data, null, 2));
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  const { hash } = readAuth();
  const valid = await bcrypt.compare(password, hash);
  if (!valid) return res.status(401).json({ error: 'Invalid password' });

  const token = jwt.sign(
    { role: 'admin' },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '30d' }
  );
  res.json({ token });
});

// POST /api/auth/change-password  (protected)
router.post('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: 'Both passwords required' });
  if (newPassword.length < 6)
    return res.status(400).json({ error: 'New password must be at least 6 characters' });

  const auth = readAuth();
  const valid = await bcrypt.compare(currentPassword, auth.hash);
  if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

  auth.hash = await bcrypt.hash(newPassword, 10);
  writeAuth(auth);
  res.json({ message: 'Password changed successfully' });
});

module.exports = router;
