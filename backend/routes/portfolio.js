const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/portfolio.json');
const UPLOAD_DIR = path.join(__dirname, '../uploads');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|webm/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  },
});

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}
function nextId(arr) {
  const max = arr.reduce((m, item) => Math.max(m, parseInt(item.id || 0)), 0);
  return String(max + 1);
}

// ── Public read endpoints ────────────────────────────────────────────────────

router.get('/', (_req, res) => {
  const data = readData();
  const { bio, contact, projects, skills, experience, education, softSkills } = data;
  res.json({ bio, contact, projects, skills, experience, education, softSkills });
});

router.get('/bio', (_req, res) => res.json(readData().bio));
router.get('/contact', (_req, res) => res.json(readData().contact));
router.get('/projects', (_req, res) => res.json(readData().projects));
router.get('/skills', (_req, res) => {
  const { skills, experience, education, softSkills } = readData();
  res.json({ skills, experience, education, softSkills });
});

// ── Admin write endpoints (all protected) ───────────────────────────────────

router.put('/bio', authMiddleware, (req, res) => {
  const data = readData();
  data.bio = { ...data.bio, ...req.body };
  writeData(data);
  res.json(data.bio);
});

router.put('/contact', authMiddleware, (req, res) => {
  const data = readData();
  data.contact = { ...data.contact, ...req.body };
  writeData(data);
  res.json(data.contact);
});

// Projects
router.post('/projects', authMiddleware, (req, res) => {
  const data = readData();
  const project = { id: nextId(data.projects), ...req.body };
  data.projects.push(project);
  writeData(data);
  res.status(201).json(project);
});

router.put('/projects/:id', authMiddleware, (req, res) => {
  const data = readData();
  const idx = data.projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });
  data.projects[idx] = { ...data.projects[idx], ...req.body, id: req.params.id };
  writeData(data);
  res.json(data.projects[idx]);
});

router.delete('/projects/:id', authMiddleware, (req, res) => {
  const data = readData();
  const idx = data.projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });
  data.projects.splice(idx, 1);
  writeData(data);
  res.json({ message: 'Deleted' });
});

// Skills
router.post('/skills', authMiddleware, (req, res) => {
  const data = readData();
  const skill = { id: nextId(data.skills), ...req.body };
  data.skills.push(skill);
  writeData(data);
  res.status(201).json(skill);
});

router.put('/skills/:id', authMiddleware, (req, res) => {
  const data = readData();
  const idx = data.skills.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Skill not found' });
  data.skills[idx] = { ...data.skills[idx], ...req.body, id: req.params.id };
  writeData(data);
  res.json(data.skills[idx]);
});

router.delete('/skills/:id', authMiddleware, (req, res) => {
  const data = readData();
  const idx = data.skills.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Skill not found' });
  data.skills.splice(idx, 1);
  writeData(data);
  res.json({ message: 'Deleted' });
});

// Reorder skills
router.put('/skills', authMiddleware, (req, res) => {
  const data = readData();
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Expected array' });
  data.skills = req.body;
  writeData(data);
  res.json(data.skills);
});

// Tabs content (experience / education / softSkills)
router.put('/experience', authMiddleware, (req, res) => {
  const data = readData();
  data.experience = { ...data.experience, ...req.body };
  writeData(data);
  res.json(data.experience);
});

router.put('/education', authMiddleware, (req, res) => {
  const data = readData();
  data.education = { ...data.education, ...req.body };
  writeData(data);
  res.json(data.education);
});

router.put('/softskills', authMiddleware, (req, res) => {
  const data = readData();
  data.softSkills = { ...data.softSkills, ...req.body };
  writeData(data);
  res.json(data.softSkills);
});

// File upload
router.post('/upload', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
