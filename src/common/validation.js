/* jshint ignore:start */
'use strict';

const parseUrl = require('url-parse');
const config = require('config');
const {isValidJsonString} = require('./utils');

const { check, validationResult } = require('express-validator');
const {response, elog, flog, isEmptyObject } = require('../common/utils');
const {LOG, RESPONSE, ENV} = require('../common/const');

const logger = flog;
const logerr = elog;

const REGEX_ISO8601 = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/g;

const checkValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
        req.body.tid = res.locals.tid;
        let body = {
            code: RESPONSE.BAD_REQUEST.code,
            message: RESPONSE.BAD_REQUEST.message,
            tid: req.body.tid
        };

        let err = response(errors.array(), RESPONSE.BAD_REQUEST);

        if (process.env.DEBUG) {
            body = err;
        }

        return res.status(400).json(body)
    }
    next();
};

const checkAuth = (req, res, next) => {
    return true;
};

const checkRange = (req, res, next) => {
    let body = {};
    const {from, to} = req.query;

    if (Boolean(from)) {
        if ('string' === typeof from) {
            if (!from.match(REGEX_ISO8601)) {
                body = {code: 4000, message: '"from" parameter requires ISO8601 format'};
            }
        } else {
            body = {code: 4000, message: 'Invalid "from" parameter format'};
        }
    } else {
        body = {code: 4000, message: '"from" parameter is missing'};
    }

    if (Boolean(to)) {
        if ('string' === typeof to) {
            body = {code: 4000, message: '"to" parameter requires ISO8601 format'};
        } else {
            body = {code: 4000, message: 'Invalid "to" parameter format'};
        }
    } else {
        body = {code: 4000, message: '"to" parameter is missing'};
    }

    return isEmptyObject(body) ? res.status(200).json(body) : next();
};

const validators = {
    auth: [
        checkAuth
    ]
};

function validator(method) {
    console.log('method: ', method);
    if (validators[method] !== undefined) {
        console.log('validator1: ', validators[method]);
        return validators[method];
    } else {
        console.log('validator2: ', validators.auth);
        return validators.auth;
    }
}

module.exports = validator;
