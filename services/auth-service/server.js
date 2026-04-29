require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

/* =========================
   KONFIGURASI SESSION
========================= */
app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: true
}));

/* =========================
   INISIALISASI PASSPORT
========================= */
app.use(passport.initialize());
app.use(passport.session());

/* =========================
   KONFIGURASI GOOGLE OAUTH
========================= */
passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    },
    (accessToken, refreshToken, profile, done) => {
        console.log('Google Profile:', profile);
        return done(null, profile);
    }
));

/* =========================
   SERIALIZE & DESERIALIZE
========================= */
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

/* =========================
   ROUTES
========================= */

// Login Google
app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

// Callback setelah login berhasil
app.get('/auth/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/profile');
    }
);

// Profile pengguna
app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/google');
    }

    res.send(`nigggaaaaaa, ${req.user.displayName}!`);
});

/* =========================
   JALANKAN SERVER
========================= */
app.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});