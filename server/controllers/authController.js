const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'E-Mail existiert bereits' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, role: role || 'user' });
    res.status(201).json({ message: 'Registrierung erfolgreich', user: { email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Fehler bei der Registrierung' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Ungültige Anmeldedaten' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Ungültige Anmeldedaten' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Login' });
  }
};