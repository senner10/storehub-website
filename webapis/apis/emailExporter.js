const express = require('express')
const Json2csvParser = require('json2csv').Parser;

var router = express.Router()
var email = require("../db/models/email")

router.get("/export_emails/:id/:name", (req, res) => {
    var qry = email.find({ owner: req.owner, event: req.params.id }, (err, emails) => {
        if (err) {
            res.status(500).send(err);
            return;
        }


        var fields = ['email', 'created_at'];


        var json2csvParser = new Json2csvParser({ fields });
        var csv = json2csvParser.parse(emails);

        res.set({
            "Content-Disposition": `attachment; filename="${req.params.name}.csv"`,
            'Content-type': 'text/csv'
        });
        res.send(csv);


    })

})

module.exports = router;