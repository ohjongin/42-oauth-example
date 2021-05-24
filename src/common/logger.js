'use strict'
const tracer = require('tracer');
const app_root = require('app-root-path');

const pm_id = process.env.pm_id ? `.${process.env.pm_id}:` : '';
const pid = process.pid;
const root_dir = `${app_root}/logs`
const is_prod = process.env.NODE_ENV && process.env.NODE_ENV.toLocaleLowerCase().includes('prod')
    || process.env.ENV_TYPE && process.env.ENV_TYPE.toLocaleLowerCase().includes('prod');

const logger = tracer.dailyfile({
    root: root_dir,
    splitFormat: `yyyymmdd${pm_id}`,
    allLogsFileName: 'app',
    preprocess: function(data) {
        data.title = `${pm_id}${pid}:${data.title.toUpperCase()}`;
    },
    transport: function(data) {
        if (is_prod) {
            return;
        }
        console.log(data.output);
    }
});

// noinspection DuplicatedCode
const logerr = tracer.dailyfile({
    root: root_dir,
    splitFormat: `yyyymmdd${pm_id}`,
    allLogsFileName: 'err',
    preprocess: function(data) {
        data.title = `${pm_id}${pid}:${data.title.toUpperCase()}`;
    },
    transport: function(data) {
        console.log(data.output);
    }
});

const loginf = tracer.dailyfile({
    root: root_dir,
    splitFormat: `yyyymmdd${pm_id}`,
    allLogsFileName: 'inf',
    preprocess: function(data) {
        data.title = `${pm_id}${pid}:${data.title.toUpperCase()}`;
    },
    transport: function(data) {
        if (is_prod) {
            return;
        }
        console.log(data.output);
    }
});

module.exports = {
    logger,
    logerr,
    loginf
}