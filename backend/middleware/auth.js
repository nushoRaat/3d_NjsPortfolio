const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'dev-secret', (err, payload) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.admin = payload;
    next();
  });
};
