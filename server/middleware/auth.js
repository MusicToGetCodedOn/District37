import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Ungültiger oder fehlender Authorization-Header' });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Token fehlt' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: `Ungültiger Token: ${err.message}` });
  }
};

export const requireRole = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Kein Benutzer authentifiziert' });
  }
  if (!Array.isArray(roles) ? req.user.role !== roles : !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Keine Berechtigung' });
  }
  next();
};