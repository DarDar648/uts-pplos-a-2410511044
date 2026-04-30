const bcrypt = require('bcryptjs');

let users = [
  {
    id: 1,
    username: 'testuser',
    password: bcrypt.hashSync('pass', 10),
  }
];

let refreshTokens = [];
let blacklistedTokens = [];

module.exports = {
  findByUsername: (username) =>
    users.find(user => user.username === username),

  findById: (id) =>
    users.find(user => user.id === id),

  saveRefreshToken: (token) => {
    refreshTokens.push(token);
  },

  removeRefreshToken: (token) => {
    refreshTokens = refreshTokens.filter(t => t !== token);
  },

  isRefreshTokenValid: (token) => {
    return refreshTokens.includes(token);
  },

  blacklistToken: (token) => {
    blacklistedTokens.push(token);
  },

  isTokenBlacklisted: (token) => {
    return blacklistedTokens.includes(token);
  }
};
