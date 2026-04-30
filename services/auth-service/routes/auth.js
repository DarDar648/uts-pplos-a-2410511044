const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {
  jwtSecret,
  jwtExpiresIn,
  refreshSecret,
  refreshExpiresIn
} = require('../config');

const {
  findByUsername,
  findById,
  saveRefreshToken,
  removeRefreshToken,
  isRefreshTokenValid,
  blacklistToken,
  isTokenBlacklisted
} = require('../models/user');

const router = express.Router();

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    refreshSecret,
    { expiresIn: refreshExpiresIn }
  );
};

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'Token required'
    });
  }

  const token = authHeader.split(' ')[1];

  if (isTokenBlacklisted(token)) {
    return res.status(403).json({
      message: 'Token already logged out'
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = findById(decoded.id);
    next();
  } catch (err) {
    return res.status(403).json({
      message: 'Invalid or expired token'
    });
  }
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = findByUsername(username);
  if (!user) {
    return res.status(400).json({
      message: 'User not found'
    });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: 'Invalid credentials'
    });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  saveRefreshToken(refreshToken);

  return res.json({
    message: 'Login successful',
    accessToken,
    refreshToken
  });
});

router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      message: 'No refresh token provided'
    });
  }

  if (!isRefreshTokenValid(refreshToken)) {
    return res.status(403).json({
      message: 'Invalid refresh token'
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshSecret);
    const user = findById(decoded.id);
    const newAccessToken = generateAccessToken(user);

    return res.json({
      accessToken: newAccessToken
    });
  } catch (err) {
    return res.status(403).json({
      message: 'Refresh token expired'
    });
  }
});

router.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  const authHeader = req.headers.authorization;

  if (!refreshToken || !authHeader) {
    return res.status(400).json({
      message: 'Refresh token and access token required'
    });
  }

  const accessToken = authHeader.split(' ')[1];

  if (!isRefreshTokenValid(refreshToken)) {
    return res.status(403).json({
      message: 'Invalid refresh token'
    });
  }

  if (isTokenBlacklisted(accessToken)) {
    return res.status(403).json({
      message: 'Already logged out'
    });
  }

  removeRefreshToken(refreshToken);
  blacklistToken(accessToken);

  return res.json({
    message: 'Logout successful'
  });
});

router.get('/protected', authenticateJWT, (req, res) => {
  res.json({
    message: 'This is protected data',
    user: req.user
  });
});

module.exports = router;
