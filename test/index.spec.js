/* jshint ignore:start */
'use strict';
const request = require('supertest');
const { assert } = require('chai');
const { app } = require('../app');
const { version } = require('../package.json');

describe('info', () => {
    it('should respond with version', (done) => {
        let req = `/info`;
        request(app)
            .get(req)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) {
                    console.log(err, '\n');
                    console.log(JSON.stringify(res, null, 4), '\n');
                    done(err);
                    return;
                }

                console.log(req, '\n', JSON.stringify(res.body, null, 4), '\n');
                assert.strictEqual(res.body.version, version);
                done();
            });
    });
});
/* jshint ignore:end */