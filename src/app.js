'use strict';
const createError = require('http-errors');
const express = require('express');
const app_root = require('app-root-path');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const http = require('http');
const uuid = require('uuid/v1');
const app = express();
const { logger } = require('./common/logger');

let envfile = path.join(app_root.path, `.env.${process.env.ENV_NAME}`)
require('dotenv').config({path: envfile});

process.env["NODE_CONFIG_DIR"] = app_root.path + "/config/";
const config = require('config');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(app_root.path, 'public')));
app.use(cookieParser());
app.use(session({ resave: false, saveUninitialized: false, secret: '!Seoul' }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use('/', require('./route/router')(app));

// error handler
app.use(function(err, req, res, next) {
    logger.log(err);

    res.locals.tid = uuid();
    req.locals = {tid: res.locals.tid};

    res.json({code: 4000, status: err.status, message: err.message, tid: res.locals.tid});
});


/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    logger.log('Listening on ' + bind);
}

module.exports = app;