'use strict'
const passport = require('passport');
const FortyTwoStrategy = require('passport-42').Strategy;
const { logger } = require('./logger');

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        console.log(user);
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        console.log(obj);
        done(null, obj);
    });

    // http://www.passportjs.org/packages/passport-42/
    passport.use(new FortyTwoStrategy({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
        },
        function (accessToken, refreshToken, profile, cb) {
            logger.log('accessToken:', accessToken);
            logger.log('refreshToken:', refreshToken);
            logger.log('profile:', profile)
            return cb(null, profile);
        }));

    return passport;
}