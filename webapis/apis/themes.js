const express = require('express')
var router = express.Router()
var theme = require("../db/models/theme")

router.put('/theme', (req, res) => {
    delete req.body._id;
    theme.findOneAndUpdate({ owner: req.owner }, { $set: { theme: req.body } }, function(err, t) {
        if (err) res.status(500).send(err);
        else res.json(t);
    });
});

router.get('/theme', (req, res) => {

    var qry = theme.findOne({ owner: req.owner });

    qry.exec((err, t) => {
        if (err) {
            res.status(500).send(err);
            return;
        } else {

            if (!t) {

                t = new theme();
                t.owner = req.owner;

                t.save((err) => {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }

                    res.json(t);
                });

                return;
            }

            res.json(t);

        }
    });

})

module.exports = router;