/* jshint ignore:start */
'use strict';

const {LOG} = require('../common/const');
const logger = require('../common/logger').logger;

const getVacationList = (req, res) => {
    console.log('getVacationList');
    console.log('header: ', JSON.stringify(req.headers));
    res.json({ headers: req.headers, body: req.body, query: req.query });
};

module.exports = {
    getVacationList
};