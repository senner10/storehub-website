const express = require('express')
var router = express.Router()

var LostRes = { "error": "Resource not found" }

const File = require(`../db/models/file`)

router.get('/file/:id', function(req, res) {
    File.findOne({ _id: req.params.id }, function(err, doc) {
        if (err || !doc) res.status(404).send(err || LostRes);
        else {
            res.contentType(doc.mimetype);
            res.send(doc.data);
        }
    });
});



module.exports = router;