const path = require('path');
const express = require('express');
const session = require('express-session');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const csrf = require('csurf');
const flash = require('connect-flash');
const winston = require('winston');
const mongoStore = require('connect-mongo');

const config = require('./');

const env = process.env.NODE_ENV || 'development';

module.exports = (app, passport) => {
    // favicon 설정
    // app.use(favicon(__dirname + '/public/favicon.ico'));

    app.use(compression());

    // 로그 설정
    let log = 'dev';
    if (env !== 'development') {
        log = {
            stream: {
                write: message => winston.info(message)
            }
        };
    }
    app.use(logger(log));

    // view engine 설정
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    // passport 초기화
    app.use(passport.initialize());
    app.use(passport.session());

    // bodyParser 설정
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // cookieParser 설정
    app.use(cookieParser());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new mongoStore({
            url: config.db,
            collection: 'sessions'
        })
    }));

    // flash 설정
    app.use(flash());

    // csrf
    app.use(csrf());
    app.use((req, res, next) => {
        res.locals.csrf_token = req.csrfToken();
        next();
    });

    app.use(express.static(path.join(config.root, 'public')));

    if (env === 'development') {
        app.locals.pretty = true;
    }

    // 임시
    // TODO: 미들웨어-라우팅으로 대체해야함
    app.use((res, req, next) => {
        if(req.isAuthenticated()) {
            res.locals.user = req.user;
            next();
        }
        if (req.method === 'GET') {
            req.session.returnTo = req.originalUrl;
        }
        res.redirect('/login');
    });
};