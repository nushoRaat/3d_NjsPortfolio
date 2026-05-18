require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');

const app = express();
const PORT = process.env.PORT || 3001;

// ── One-time setup: create auth.json with default password ──────────────────
const DATA_DIR = path.join(__dirname, 'data');
const AUTH_FILE = path.join(DATA_DIR, 'auth.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

if (!fs.existsSync(AUTH_FILE)) {
  const defaultPassword = 'admin123';
  const hash = bcrypt.hashSync(defaultPassword, 10);
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ hash }, null, 2));
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║  Admin panel initialized                         ║');
  console.log('║  Default password: admin123                      ║');
  console.log('║  Please change it after your first login!        ║');
  console.log('╚══════════════════════════════════════════════════╝\n');
}

// ── Middleware ───────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'https://nushoraat.github.io',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.some(o => origin.startsWith(o))) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);

// ── Serve React build in production ─────────────────────────────────────────
const DIST = path.join(__dirname, '../dist');
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST));
  app.get('*', (_req, res) => res.sendFile(path.join(DIST, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Portfolio backend running on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:5173/admin (dev) or http://localhost:${PORT}/admin (prod)`);
});
