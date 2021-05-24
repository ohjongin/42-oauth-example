/* jshint ignore:start */
'use strict';

const config = require('config');
const moment = require('moment');
const url = require('url');
const fs = require('fs-extra');
const tracer = require('tracer');

const {RESPONSE, LOG} = require('./const');
const { version } = require('../../package.json');

const convertDateTime = (dateString) => {
    return moment(new Date(dateString)).format('YYYY-MM-DD HH:mm:SS')
};

const reqUrl = (req) => {
    const requrl = url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl,
    });
    return decodeURIComponent(requrl)
};

const createLogDirs = () => {
    // noinspection JSLint
    if (!fs.existsSync('logs')) {
        fs.mkdir('logs');
    }

    if (!fs.existsSync('logs/app')) {
        fs.mkdir('logs/app');
    }
};

/**
 * https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
 * https://cizion.atlassian.net/browse/LVR-599
 *
 * @param n
 * @returns {boolean}
 */
const isNumeric = (n) =>  {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

/**
 * https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
 * https://cizion.atlassian.net/browse/LVR-599
 *
 * @param n
 * @returns {boolean}
 */
const isInteger = (n) => {
    return !isNaN(parseInt(n)) && isFinite(n);
};

/**
 * https://stackoverflow.com/questions/11480769/how-can-i-check-if-a-json-is-empty-in-nodejs
 * @param obj
 * @returns {boolean}
 */
const isEmptyObject = (obj) => {
    return !Object.keys(obj).length;
};


const isValidJsonString = (str) => {
    try {
        let json = JSON.parse(str);
        return (typeof json === 'object');
    } catch (e) {
    }
    return false;
};

module.exports = {
    convertDateTime,
    createLogDirs,
    isInteger,
    isEmptyObject,
    isValidJsonString,
    config,
};