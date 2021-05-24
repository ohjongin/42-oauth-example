/* jshint ignore:start */
'use strict';
const request = require('supertest');
const { expect, assert } = require('chai');
const { app } = require('../../app');
const { config } = require('../../src/common/utils');