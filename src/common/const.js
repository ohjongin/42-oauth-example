'use strict';

require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV;
const NODE_LOGMODE = process.env.NODE_LOGMODE;
const IS_LOCAL_MODE = 'string' === typeof NODE_ENV && NODE_ENV.toLowerCase().startsWith('local');

exports.RESPONSE = {
  SUCCESS: {
    code: 2000,
    message: 'Success'
  },
  BAD_REQUEST: {
    code: 4000,
    message: 'Bad Request'
  },
  UNPROCESSABLE_ENTITY: {
    code: 4220,
    message: 'Unprocessable Entity'
  },
  NOT_FOUND: {
    code: 4040,
    message: 'Not Found'
  },
};

exports.LOG = {
  MODE: NODE_LOGMODE,
  IS_ENABLED: NODE_LOGMODE !== undefined,
  IS_VERBOSE: NODE_LOGMODE !== undefined,
  TYPE: {
    DEFAULT: 'default',
    MEDIA: 'media'
  },
  ACTION: {
    REQUEST: 'request',
    RESPONSE: 'response',
    ERROR: 'error'
  }
};

exports.ENV = {
  NODE_ENV: NODE_ENV,
  IS_PROD_MODE: 'string' === typeof NODE_ENV && NODE_ENV.toLowerCase().startsWith('prod'),
  IS_DEV_MODE: 'string' === typeof NODE_ENV && NODE_ENV.toLowerCase().startsWith('dev'),
  IS_TEST_MODE: 'string' === typeof NODE_ENV && NODE_ENV.toLowerCase().startsWith('test'),
  IS_LOCAL_MODE: IS_LOCAL_MODE
};