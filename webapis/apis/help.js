const express = require('express')
var router = express.Router()
var helpRequest = require("../db/models/helpRequest")


router.post("/help", (req,res) => {

	var h = new helpRequest(req.body);
	h.owner = req.owner;
	h.created_at = new Date();
	h.save((err) => {
		if(err){
			res.status(500).send(err)
			return
		}
		res.json(h);
	})

});

module.exports = router;