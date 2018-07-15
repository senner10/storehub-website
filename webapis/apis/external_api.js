const express = require('express')
var router = express.Router()
var website = require("../db/models/website"),
    event = require("../db/models/event"),
    image = require("../db/models/image"),
    analytic = require("../db/models/analytic"),
    location = require("../db/models/location"),
    email = require("../db/models/email"),
    product = require("../db/models/product"),
    theme = require("../db/models/theme")



router.get("/get_locations", (req, res) => {

    var ip = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0];

    var tokens = req.headers.token.split(",");
    website.findOne({ _id: tokens[0], secret: tokens[1] }, (err, w) => {

        if (err) {
            res.status(500).send(err)
            return
        }

        if (!w) {
            res.status(401).json({ "error": "unauthorized access." })
            return
        }


        location.find({ owner: w.owner }, (err, locations) => {
            if (err) {
                res.status(500).send(err)
                return
            }
            var result = { w, locations }
            res.json(result)

        })

    });

})

router.get("/user_theme/:id", (req, res) => {

    theme.findOne({ owner: req.params.id }, (err, t) => {
        if (err) {
            res.status(500).send(err)
            return
        }
        res.json(t);
    })

})



module.exports = router;