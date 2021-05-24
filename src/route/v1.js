'use strict';

const express = require('express');
const v1 = express.Router();
const validator = require('../../common/validation');
const controller = require('../../controller/controller');

v1.get('/info', (req, res) => {
    res.json({ result: 'ok' });
});

module.exports = v1;