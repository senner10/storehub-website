const express = require('express')
const jwt = require('jsonwebtoken');
const randomstring = require("randomstring");
var router = express.Router();
var User = require("../db/models/user");
var configd = require("configd");
const JWTKey = configd.JWTKey;
const sha256 = require("sha256");
const nodemailer = require('nodemailer');


// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: configd.SMTPUsername,
        pass: configd.SMTPPassword
    }
});

var stripe = require("stripe")(
    configd.stripeSecret
);


var month = ((84600 * 1000) * 7) * 4

router.get('/logout', (req, res) => {

    delete req.session.token;
    delete req.session._id;
    res.json({});
});


router.post('/join', (req, res) => {

    var username = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var plan_id = req.body.plan_id;

    var newo = new User();
    var sess = req.session;
    var d = (new Date()).getTime();

    newo.name = name;
    newo.email = username;
    newo.password = password;
    newo.plan_id = plan_id;
    newo.expiration_time = d + month;

    newo.save(function(err) {
        if (err) {
            res.status(500).send(err);
        } else
            GenerateToken(newo, sess, res);
    })
})

router.get('/delete_account', (req, res) => {

    var qry = User.findOne({ _id: req.session.userid });

    qry.exec((err, usr) => {

        if (err) {
            res.status(500).send(err);
            return;
        }

        stripe.subscriptions.del(
            usr.sub_id,
            function(err, confirmation) {
                // asynchronously called
                if (err) {
                    res.status(500).json({});
                    return;
                }

                res.json({});

            })
    })

});

router.post('/reset_password', (req, res) => {
    var new_password = randomstring.generate(6);

    User.findOneAndUpdate({ email: req.body.email }, { $set: { password: sha256(new_password) } }).exec(function(err, bear) {
        if (err)
            res.status(401).send(err);
        else if (!bear) res.status(401).json({ error: "Invalid account." });
        else {

            // message template nested to use templated string
            var message = `Hi ${bear.name},
Your new password is '${new_password}'. We highly recommend updating your password once logged in.

StoreHub`;

            var email = {
                from: configd.SMTPUsername,
                to: bear.email,
                subject: 'StoreHub password reset.',
                text: message
            }

            transporter.sendMail(email, function(err) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                    return;
                }
                res.status(200).json({});
            });

        }
    });
});

router.post('/update_password', (req, res) => {
    User.findOneAndUpdate({ _id: req.body.userid, password: req.body.password }, { $set: { password: req.body.new_password } }).exec(function(err, bear) {
        if (err)
            res.status(401).send(err);
        else if (!bear) res.status(401).json({ error: "Invalid password." });
        else {
            res.status(200).json({});
        }
    });
});

router.get('/is_loggedin', function(req, res) {
    if (req.session.token) {
        res.json({ token: req.session.token, id: req.session.userid, name: req.session.userName })
    } else res.status(401).json({ "error": "User is not signed in." });
});



router.post('/login', function(req, res) {

    var sess = req.session
    var username = req.body.email;
    var password = req.body.password;

    User.findOne({ email: username, password: password }).exec(function(err, bear) {
        if (err)
            res.status(401).send(err);
        else if (!bear) res.status(401).json({ error: "Invalid username/password." });
        else {
            GenerateToken(bear, sess, res);
        }
    });

});

var GenerateToken = (bear, sess, res) => {
    var token = jwt.sign({
        userid: bear._id,
    }, JWTKey, {
        expiresIn: '2 days',
    });
    sess.userid = bear._id;
    sess.token = token;
    sess.apps = bear.apps;
    sess.plan = bear.plan_id ? bear.plan_id : "Essential";
    sess.userName = bear.name;
    res.json({ token: token, name: bear.name, id: sess.userid });
}



module.exports = router;