'use strict';

// dependencies
require('dotenv').config();

const express = require('express');
const passport = require('passport');
const debug = require('debug')('HeVote:server');
const http = require('http');
const mongoose = require('mongoose');

const config = require('./config');
const app = express();

// set port
app.set('port', normalizePort(process.env.PORT || '4000'));

// Bootstrap 설정
require('./config/passport')(passport);
require('./config/express')(app, passport);
require('./config/routes')(app, passport);

/**
 * HTTP server를 만듭니다.
 */
const server = http.createServer(server);

// MongoDB에 접속 후 서버 열기
mongoose.connect(config.db).connection
    .on('error', console.error)
    .on('open', listen);

/**
 * Listen on provided port, on all network interfaces.
 */
function listen() {
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
}
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
    const address = server.address();
    const bind = typeof address === 'string'
        ? 'pipe ' + address
        : 'port ' + address.port;
    debug('Listening on ' + bind);
}
