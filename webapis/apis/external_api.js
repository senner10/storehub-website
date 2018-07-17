const express = require('express')
var router = express.Router()
var Mailchimp = require('mailchimp-api-v3')
var website = require("../db/models/website"),
    event = require("../db/models/event"),
    image = require("../db/models/image"),
    analytics = require("../db/models/analytic"),
    location = require("../db/models/location"),
    email = require("../db/models/email"),
    product = require("../db/models/product"),
    theme = require("../db/models/theme"),
    mailchimp = require("../db/models/mailchimp")


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


router.get("/user_events/:id", (req, res) => {

    event.find({ owner: req.params.id }, (err, evs) => {
        sendResponse(err, evs, res);
    })

})

router.post("/save_email", (req, res) => {


    event.findOne({ _id: req.body.event }, (err, e) => {
        if (err) {
            res.status(500).send(err)
            return;
        }

        mailchimp
            .findOne({ owner: e.owner })
            .exec((err, mc) => {
                if (err) {
                    res.status(500).send(err)
                    return;
                }

                if (!mc) {
                    saveEmail(req,res);
                    return;
                }

                var m = new Mailchimp(mc.apiKey);

                if (!e.meta || !e.meta.mailchimp) {

                    var list = {
                        name: `${e.name} list`,
                        contact: "help@storehub.com",
                        permission_reminder: `You RSVP'd to event ${e.name}`,
                        campaign_defaults: {
                            from_name: mc.fromName,
                            from_email: mc.fromEmail,
                            subject: `New update on event ${e.name}`,
                            language: "English"
                        },
                        contact: {
                            company: "Storehub",
                            address1: "",
                            city: "",
                            state: "",
                            zip: "",
                            country: ""
                        }
                    }

                    m.request({
                        method: 'post',
                        path: '/lists',
                        body: list
                    }, (err, result) => {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        if (!e.meta) {
                            e.meta = {};
                        }

                        e.meta.mailchimp = result.id;

                        event.findOneAndUpdate({ _id: e._id }, {
                                $set: { meta: e.meta }
                            },
                            (err) => {

                                if (err) {
                                    console.log(err);
                                }
                                storeEmail(req, res, e, m)
                            }
                        )
                    })

                } else {
                    storeEmail(req, res, e, m);
                }
            })

    });


})

router.get("/user_product/:id", (req, res) => {
    product.findOne({ _id: req.params.id }, (err, p) => {
        sendResponse(err, p, res);
    })
})


router.get("/stat/:id/:type", (req, res) => {

    var product = req.params.id,
        type = parseInt(req.params.type);

    var d = new Date();
    var date = new Date(d.toDateString());

    var stat = { $inc: { counter: 1 } }

    analytics.update({
        type,
        product,
        date
    }, stat, { upsert: true }, function(err) {
        if (err) {
            console.log(err);
        }
    })

    res.json({});
})

router.get("/user_products/:ids", (req, res) => {
    var ids = req.params.ids.split(",");

    product.find({ _id: { $in: ids } }, (err, p) => {
        sendResponse(err, p, res);
    })
})

router.get("/user_image/:id", (req, res) => {
    image.findOne({ _id: req.params.id }, (err, i) => {
        sendResponse(err, i, res);
    })
})

router.get("/user_theme/:id", (req, res) => {

    theme.findOne({ owner: req.params.id }, (err, t) => {
        sendResponse(err, t, res);
    })

})

function sendResponse(err, data, res) {
    if (err) {
        res.status(500).send(err)
        return
    }
    res.json(data);
}

function storeEmail(req, res, e, m) {

    m.request({
        method: 'post',
        path: `/lists/${e.meta.mailchimp}/members`,
        body: {
            email_address: req.body.email,
            status: "subscribed"
        }
    }, (err, result) => {
        if (err) {
            console.log(err);
            sendResponse(err, {}, res);
            return;
        }
        saveEmail(req,res);

    })
}

function saveEmail(req, res) {
    var e = new email(req.body)
    e.save((err) => {
        sendResponse(err, e, res);
    })
}


module.exports = router;