require('dotenv').config();
const passport = require("passport");
const FacebookStrategy = require("passport-facebook-token");
const {
    Strategy: GoogleStrategy
} = require("passport-google-token");

const FacebookStrategyCallback = (accessToken, refreshToken, profile, done) => done(null, {
    accessToken,
    refreshToken,
    profile
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET
}, FacebookStrategyCallback));

const GoogleStrategyCallback = (accessToken, refreshToken, profile, done) => done(null, {
    accessToken,
    refreshToken,
    profile
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
}, GoogleStrategyCallback));

const authenticateFacebook = (req, res) => new Promise((resolve, reject) => {
    passport.authenticate("facebook-token", {
        session: false
    }, (err, data, info) => {
        if (err) reject(err);
        resolve({
            data,
            info
        });
    })(req, res);
});

const authenticateGoogle = (req, res) => new Promise((resolve, reject) => {
    passport.authenticate("google-token", {
        session: false
    }, (err, data, info) => {
        if (err) reject(err);
        resolve({
            data,
            info
        });
    })(req, res);
});

module.exports = {
    authenticateFacebook,
    authenticateGoogle
};