'use strict';

/*
  다수 프로젝트가 같이 사용하는 공통 모듈은 git으로 버전 관리가 어려우니 revision history를 별도로 작성
    2018-03-28 rev1 warning 제거 및 exports 별도 분리
               rev1 일정 시간 이내에 같은 메시지를 계속 쏘지 않도록 새로운 function 추가
    2018-04-02 rev2 tag file이 없을 때 오동작하는 문제 수정
 */
const os = require('os');
const moment = require('moment');
const { WebClient } = require('@slack/client');
const fs = require('fs-extra');
const config = require('config');

const utils = require('./utils.js');
const { ENV } = require('./const');

const logger = utils.flog;
const logerr = utils.elog;

/**
 * 기본 10분에 10번 이상 오류가 발생하면 슬랙에 알림을 보낸다.
 * 슬랙에 알림을 보내기 전에 마지막 슬랙 알림이 10분 이내이면 알림을 중복 발송하지 않는다.
 *
 * @param msg
 * @param err
 * @param ok
 */
const sendSlackAlert = (msg, err, ok) => {
    if ('string' !== typeof msg) return;

    const slack = new WebClient(config.slack.cizion.token);

    // See: https://api.slack.com/methods/chat.postMessage
    let slackMsg = {
        channel: config.slack.cizion.ch_id_passport,
        as_user: false,
        username: 'PASSPORT',
        icon_url: 'https://101.livere.co.kr/cizion/slack/images/ic_passport.png',
        attachments: [
            {
                'title': 'ERROR ALERT: ' + err + '/' + (err + ok) + ' error(s)',
                'text': msg,
                'pretext': os.hostname()
            }
        ]
    };

    /* Definitely an error in webstorm.
       Would appreciate it if you report it here :
       http://youtrack.jetbrains.com/issues/WEB and put a link so we can vote on it.*/
    // noinspection JSCheckFunctionSignatures
    slack.chat.postMessage(slackMsg)
        .catch(function (err) {
            logger.error(err);
        });
};

// noinspection JSUnusedLocalSymbols
const sendSampleSlackMessage = function (msg, err, ok) { // jshint ignore:line
    if ('string' !== typeof msg) return;

    const slack = new WebClient(config.slack.cizion.token);

    // See: https://api.slack.com/methods/chat.postMessage
    let slackMsg = {
        channel: config.slack.cizion.ch_id_passport,
        as_user: false,
        username: 'PASSPORT',
        icon_url: 'https://101.livere.co.kr/cizion/slack/images/ic_passport.png',
        attachments: [
            {
                'fallback': 'Required plain-text summary of the attachment.',
                'color': '#2eb886',
                'pretext': 'Optional text that appears above the attachment block',
                'author_name': 'Bobby Tables',
                'author_link': 'http://flickr.com/bobby/',
                'author_icon': 'http://flickr.com/icons/bobby.jpg',
                'title': 'Slack API Documentation',
                'title_link': 'https://api.slack.com/',
                'text': 'Optional text that appears within the attachment',
                'fields': [
                    {
                        'title': 'Priority',
                        'value': 'High',
                        'short': false
                    }
                ],
                'image_url': 'http://my-website.com/path/to/image.jpg',
                'thumb_url': 'http://example.com/path/to/thumb.png',
                'footer': 'Slack API',
                'footer_icon': 'https://platform.slack-edge.com/img/default_application_icon.png',
                'ts': moment().valueOf() / 1000
            }
        ]
    };

    /* Definitely an error in webstorm.
       Would appreciate it if you report it here :
       http://youtrack.jetbrains.com/issues/WEB and put a link so we can vote on it.*/
    // noinspection JSCheckFunctionSignatures
    slack.chat.postMessage(slackMsg)
        .catch(function (err) {
            logger.error(err);
        });
};

/**
 일반적인 슬랙 메시지 전송
 https://api.slack.com/docs/message-attachments
 {
    channel: config.slack.cizion.ch_id_passport,
    as_user: false,
    username: 'PASSPORT',
    icon_url: 'https://101.livere.co.kr/cizion/slack/images/ic_passport.png',
    attachments: [
        {
            "fallback": "Required plain-text summary of the attachment.",
            "color": "#2eb886",
            "pretext": "Optional text that appears above the attachment block",
            "author_name": "Bobby Tables",
            "author_link": "http://flickr.com/bobby/",
            "author_icon": "http://flickr.com/icons/bobby.jpg",
            "title": "Slack API Documentation",
            "title_link": "https://api.slack.com/",
            "text": "Optional text that appears within the attachment",
            "fields": [
                {
                    "title": "Priority",
                    "value": "High",
                    "short": false
                }
            ],
            "image_url": "http://my-website.com/path/to/image.jpg",
            "thumb_url": "http://example.com/path/to/thumb.png",
            "footer": "Slack API",
            "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
            "ts": 123456789
        }
    ]
}
 */

/**
 * slack 메시지를 자유롭게 보낼 수 있도록 생성한 function
 * @param token
 * @param slackMsg
 */
const sendSlackMessage = (token, slackMsg) => {
    if ('object' !== typeof slackMsg || 'string' !== typeof token) return;

    const slack = new WebClient(token);

    /* Definitely an error in webstorm.
       Would appreciate it if you report it here :
       http://youtrack.jetbrains.com/issues/WEB and put a link so we can vote on it.*/
    // noinspection JSCheckFunctionSignatures
    slack.chat.postMessage(slackMsg)
        .catch(function (err) {
            logger.error(err);
        });
};

/**
 * slack 메시지를 자유롭게 보낼 수 있도록 생성한 function
 * @param token
 * @param slackMsg
 * @param tag
 * @param duration
 */
const sendSlackMessageSafe = async (token, slackMsg, tag, duration) => {
    if ('object' !== typeof slackMsg || 'string' !== typeof token) return;

    const fname = `${tag}.json`;

    const slack = new WebClient(token);

    let txt = await new Promise((resolve, reject) => {
        try {
            if (fs.existsSync(fname)) {
                fs.readFile(fname, function(err, buf) {
                    if (err) {
                        logerr.error(err);
                        reject(JSON.stringify({timestamp: 0}));
                        return;
                    }

                    resolve(buf.toString());
                });
            } else {
                resolve(JSON.stringify({timestamp: 0}));
            }
        } catch (e) {
            logerr.error(e);
            resolve(JSON.stringify({timestamp: 0}));
        }
    });

    let json = {
        timestamp: 0
    };
    try {
        json = JSON.parse(txt);
    } catch (e) {
        logerr.error(e);
    }

    let threshold = ENV.IS_PROD_MODE ? duration : 60*1000;
    let last = 'number' === typeof json.timestamp ? json.timestamp : 0;
    let now = moment().valueOf();
    let ok = (now - last > threshold);

    if (ok) {
        slackMsg.channel = ENV.IS_PROD_MODE ? config.slack.cizion.ch_id_dev_alarm : config.slack.cizion.ch_id_dev_test;

        /* Definitely an error in webstorm.
           Would appreciate it if you report it here :
           http://youtrack.jetbrains.com/issues/WEB and put a link so we can vote on it.*/
        // noinspection JSCheckFunctionSignatures
        slack.chat.postMessage(slackMsg)
            .catch(function (err) {
                logger.error(err);
            })
            .finally(() => {
                try {
                    json.timestamp = moment().valueOf();
                    let data = JSON.stringify(json);
                    fs.writeFile(fname, data, function(err) {
                        if (err) logerr.error(err);
                    });
                } catch (e) {
                    logerr.error(e);
                }
            });
    }
};

// noinspection JSUnusedGlobalSymbols
module.exports = {
    sendSlackAlert,
    sendSlackMessage,
    sendSlackMessageSafe
};
