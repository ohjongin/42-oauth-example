/* jshint ignore:start */
'use strict';
const config = require('config');
const express = require('express');
const router = express.Router();
const { logger } = require('../common/logger');
const { version } = require('../../package.json');

router.use((req, res, next) => {
    logger.log(`[${req.method}] ${req.url}`)
    next();
});

router.get('/', (req, res) => {
    res.setHeader('content-type', 'text/html');
    if (req.isAuthenticated()) {
        res.render('home', { user: req.user, profile:  req.user?.profileUrl});
    } else {
        res.render('login');
    }
});

router.get('/healthCheck', (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.json({ result: 'ok' });
});

router.get('/info', (req, res) => {
    let stage = process.env.NODE_ENV || config.name;
    let remoteIP = req.headers['x-forwarded-for'] ||  req.socket.remoteAddress;
    let body = { version: version, stage: stage, remoteIP: remoteIP };
    res.setHeader('content-type', 'application/json');
    res.json(body);
});

router.use((err, req, res, next) => {
    logger.log(err);
    next();
});

router.use('/v1', require('./v1'));

module.exports = (app) => {
    const passport = require('../common/passport')(app);
    router.use('/auth', require('./auth')(passport));

    return router;
}
