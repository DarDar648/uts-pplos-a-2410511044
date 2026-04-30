require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: '15m',
    refreshSecret: process.env.REFRESH_SECRET,
    refreshExpiresIn: '7d', // refresh token
    port: process.env.PORT || 3000,

    googleAuth: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    },

    session: {
        secret: process.env.SESSION_SECRET
    }
   
};
