require('dotenv').config();

module.exports = {
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