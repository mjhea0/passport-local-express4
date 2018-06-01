const nodemailer = require('nodemailer');
const emailconfig = require('../config/email-config');


const transporter = nodemailer.createTransport(emailconfig());


module.exports = function (from, to, subject, text) {


    const mailOpt = {
        from: 'alstn224@naver.com',
        to: to,
        subject: subject,
        text: text
    };


    transporter.sendMail(mailOpt, (err, res) => {
        if (err) {
            console.log('mail-error' + err);
            // cb(err);
        } else {
            console.log('mail-success');
            // cb(null, res);
        }
        transporter.close();
    });

};