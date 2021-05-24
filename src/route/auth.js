'use strict';
const express = require('express');
const auth = express.Router();
const { logger } = require('../../common/logger');

auth.get('/login', (req, res) => {
    res.setHeader('content-type', 'text/html');
    res.render('login');
});

auth.get('/logout', function (req, res) {
    req.logout();
    req.session.save(function () {
        res.redirect('../../');
    });
});

module.exports = (passport) => {
    auth.get('/42', passport.authenticate('42'));

    auth.get('/42/callback',
        passport.authenticate('42', {
            failureRedirect: '/login'
        }),
        function (req, res) {
            res.redirect('../../');
        }
    );

    return auth;
}
