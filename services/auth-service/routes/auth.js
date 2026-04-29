// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtSecret, jwtExpiresIn } = require('../config');
const { findByUsername, findById } = require('../models/user');

const router = express.Router();

// Fungsi untuk membuat token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
};

// Login dan menghasilkan token JWT
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = findByUsername(username);
  if (!user) {
    return res.status(400).json({
      message: 'User not found'
    });
  }

  const isPasswordValid = bcrypt.compareSync(
    password,
    user.password
  );

  if (!isPasswordValid) {
    return res.status(401).json({
      message: 'Invalid credentials'
    });
  }

  const token = generateToken(user);

  return res.json({
    message: 'Login successful',
    token
  });
});

// Middleware untuk memverifikasi JWT
const authenticateJWT = (req, res, next) => {
  const token =
    req.headers.authorization &&
    req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Token not provided'
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    // Simpan data pengguna ke request
    req.user = findById(decoded.id);

    next();
  } catch (err) {
    return res.status(403).json({
      message: 'Invalid token'
    });
  }
};

// Rute yang dilindungi
router.get('/protected', authenticateJWT, (req, res) => {
  res.json({
    message: 'This is protected data',
    user: req.user
  });
});

module.exports = router;