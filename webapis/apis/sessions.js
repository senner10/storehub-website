const express = require('express')
const jwt = require('jsonwebtoken');
const JWTKey = "shhh";
const randomstring = require("randomstring");
var router = express.Router();
var User = require("../db/models/user");

router.get('/logout', (req, res) => {

    delete req.session.token;
    delete req.session._id;
    res.json({});
});


router.post('/join', (req, res) => {

    var username = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var newo = new User();

    var sess = req.session;

    newo.name = name;
    newo.email = username;
    newo.password = password;

    newo.save(function(err) {
        if (err) {
            res.status(500).send(err);
        } else
            GenerateToken(newo, sess, res);
    })
})

router.get('/delete_account', (req, res) => {

});

router.post('/reset_password', (req, res) => {
    var new_password = randomstring.generate(6);
    User.findOneAndUpdate({ email: req.body.email }, { $set: { password: new_password } }).exec(function(err, bear) {
        if (err)
            res.status(401).send(err);
        else if (!bear) res.status(401).json({ error: "Invalid account." });
        else {
            res.status(200).json();
        }
    });
});

router.post('/update_password', (req, res) => {
    User.findOneAndUpdate({ _id: req.body.userid, password: req.body.password }, { $set: { password: req.body.new_password } }).exec(function(err, bear) {
        if (err)
            res.status(401).send(err);
        else if (!bear) res.status(401).json({ error: "Invalid password." });
        else {
            res.status(200).json();
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
        expiresIn: '100 days',
    });
    sess.userid = bear._id;
    sess.token = token;
    sess.userName = bear.name;
    res.json({ token: token, name: bear.name, id: sess.userid });
}



module.exports = router;