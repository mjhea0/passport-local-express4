'use strict';

exports.requireLogin = (res, req, next) => {
    if(req.isAuthenticated()) {
        res.locals.user = req.user;
        next();
    }
    if (req.method === 'GET') {
        req.session.returnTo = req.originalUrl;
    }
    res.redirect('/login');
};