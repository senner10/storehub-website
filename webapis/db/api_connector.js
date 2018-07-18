var models = require("./db")
var File = require(`./models/file`)
const express = require('express')
const authenticator = require("./security/endpoints")
const randomstring = require("randomstring");

var LostRes = { "error": "Resource not found" }

var connector = {}


connector.Get = (model, populate) => {

    return function(req, res) {

        var data = { _id: req.params.id };
        var qry = model.findOne(data);

        if (populate && req.query.agg) {
            for (var i = populate.length - 1; i >= 0; i--) {
                qry.populate(populate[i]);
            }
        }

        qry.exec(function(err, retur) {
            if (err || !retur) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(404).json(LostRes);
                }
            } else {
                res.json(retur);
            }
        });
    }
}


connector.New = (model) => {

    return function(req, res) {

        var newo = new model(req.body);
        newo.created_at = new Date();
        newo.updated_at = new Date();
        newo.owner = req.owner;

        if (model.collection.collectionName == "apis") {
            newo.secret = randomstring.generate(55);
        }

        newo.save(function(err) {
            if (err) res.status(500).send(err);
            else res.json(newo);
        })
    }
}

connector.Query = (model, enforce) => {

    return function(req, res) {
        var limit = parseInt(req.query.limit),
            skip = parseInt(req.query.skip);

        delete req.query.skip,
            delete req.query.limit;

        if (enforce) {
            req.query.owner = req.owner;
        }

        var qry = model.find(req.query || {});

        qry.sort({ updated_at: -1 });

        if (limit)
            qry.limit(limit);

        if (skip)
            qry.skip(skip)

        qry.exec(function(err, retur) {
            if (err || !retur) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(404).json(LostRes);
                }
            } else {
                res.json(retur);
            }
        });
    }
}

connector.Update = (model) => {

    return function(req, res) {

        var data = { _id: req.params.id, owner: req.owner };

        req.body.updated_at = new Date();

        delete req.body._id;
        req.body.owner = req.owner;

        model.findOneAndUpdate(data, { $set: req.body }, function(err, retur) {
            if (err) res.status(500).send(err);
            else if (!retur) res.status(404).json(LostRes);
            else res.json(retur);
        });
    }
}

connector.Delete = (model) => {

    return function(req, res) {

        var findItem = model.findOne({
            _id: req.params.id,
            owner: req.owner
        })


        findItem.exec((err, m) => {

            var data = { _id: req.params.id, owner: req.owner };
            model.remove(data, function(err, retur) {
                if (err) res.status(500).send(err);
                else if (!retur) res.status(404).json(LostRes);
                else {
                    if (m.images && m.images.length > 0) {

                        for (var i = m.images.length - 1; i >= 0; i--) {
                            var image = m.images[i];
                            removeImage(image, req.owner);
                        }

                    }
                    res.json(retur);
                }
            });
        });


    }
}

connector.BuildApiRouter = () => {
    var router = express.Router()
    router.use(authenticator)
    router.db = models.db;

    for (var i = models.models.length - 1; i >= 0; i--) {
        var model = models.models[i],
            modelName = model.collection.collectionName;

        console.log(`Registering API : ${modelName}`);
        router.post(`/${modelName}`, connector.New(model));

        router.route(`/${modelName}/:id`)
            .get(connector.Get(model))
            .put(connector.Update(model))
            .delete(connector.Delete(model))
        router.get(`/${modelName}`, connector.Query(model, true));
    }

    return router;
}

function removeImage(id, owner) {

    File.remove({
        _id: id,
        owner: owner
    }, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = connector;