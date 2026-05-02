const bcrypt = require('bcryptjs');

let users = [
  {
    username: 'drtirta',
    password: bcrypt.hashSync('tirta123', 10),
  },
  {
    username: 'drwati',
    password: bcrypt.hashSync('wati123', 10),
  },
  {
    username: 'drandi',
    password: bcrypt.hashSync('andi123', 10),
  },
  {
    username: 'dryuli',
    password: bcrypt.hashSync('yuli123', 10),
  },
  {
    username: 'drbima',
    password: bcrypt.hashSync('bima123', 10),
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
