const express = require("express")
var router = express.Router()
const Client = require('node-rest-client').Client;
var restClient = new Client();
var user = require("../db/models/user")


var planMaxs = {
    Essential: 3,
    Basic: 5,
    Professional: 7,
    Enterprise: 7
}

router.get("/activate_account", (req, res) => {
    var args = {
        data: JSON.stringify({
            "client_secret": "",
            "code": req.query.code,
            "grant_type": "authorization_code"
        }),
        headers: { "Content-type": "application/json" }
    };
    restClient.post(`https://connect.stripe.com/oauth/token`, args, function(data, response) {
        // parsed response body as js object
        if (data.error) {
            res.redirect("/?error=" + data.error_description.replace(' ', '%20'))
            return
        }

        User.findOneAndUpdate({ _id: req.owner }, { $set: { stripe_token: data.stripe_user_id } },
            (err, dta) => {
                if (err) res.redirect("/admin.html?success=Error%20updating%20account!#/stripe_settings")
                else {
                    res.redirect("/admin.html?error=Merchant%20account%20information%20saved!#/stripe_settings")
                }
            })

    });
})


router.get("/merchant_token", (req, res) => {

    var qry = user.findOne({ _id: req.owner })

    qry.exec((err, usr) => {
        if (err || !usr || !usr.stripe_token) {
            res.status(500).send(err);
            return;
        }

        res.json({});
    });

});

router.get("/app/:action/:id", (req, res) => {
    switch (req.params.action) {
        case 'install':
            //verify max
            if (planMaxs[req.session.plan] <= req.session.apps.length) {
                res.status(500).json({ "error": "limit reached." });
                return;
            }

            if (req.session.apps.indexOf(req.params.id) == -1) {
                req.session.apps.push(req.params.id);
                updateUserApps(req, res);
                return;
            }

            res.status(500).json({});

            break;
        default:

            var index = req.session.apps.indexOf(req.params.id);
            if (index != -1) {
                req.session.apps.splice(index, 1);
                updateUserApps(req, res)
                return;
            }
            res.status(500).json({ "error": "app not found." });
            break;
    }
});


router.get("/upgrade/:plan", (req, res) => {
    var plan = req.params.plan;
    var currentMax = planMaxs[req.session.plan];
    var newMax = planMaxs[plan];

    if (plan != req.session.plan) {
        req.session.plan = plan;


        var new_apps = [];
        count = 0;
        if (newMax < currentMax) {
            for (var i = req.session.apps.length - 1; i >= 0; i--) {
                new_apps.push(req.session.apps[i])
                count++;
                if (count == newMax) {
                    break;
                }
            }

        }

        req.session.apps = new_apps;

        user.findOneAndUpdate({ _id: req.owner }, { $set: { plan_id: plan, apps: new_apps } },
            (err, usr) => {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                res.json({})

            })

    } else {
        res.status(500).json();
    }

});

router.get("/apps", (req, res) => {

    var qry = user.findOne({ _id: req.owner })

    qry.exec((err, usr) => {
        if (err || !usr) {
            res.status(500).send(err);
            return;
        }
        if (!usr.apps) usr.apps = [];

        if (!usr.plan_id) usr.plan_id = "Essential";

        res.json({
            apps: usr.apps,
            plan_id: usr.plan_id,
            exp: usr.expirationTime,
            customer_id: usr.customer_id
        });
    });

});

function updateUserApps(req, res) {
    user.findOneAndUpdate({ _id: req.owner }, { $set: { apps: req.session.apps } }, (err, usr) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json({});
    })
}


module.exports = router;