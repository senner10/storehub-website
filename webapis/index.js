const express = require('express')
const app = express()
const port = process.env.PORT ? process.env.PORT : "3000";
const sessions = require("./apis/sessions")
const fileApi = require("./apis/fileApi")
const fileViewer = require("./apis/fileViewer")
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
var session = require('express-session')

const CRUDapi = require("./db/api_connector")
    .BuildApiRouter();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
    //cookie: { secure: true }
}))


// Serve static website
app.use(
    "/",
    express.static('../public'),
    fileViewer
);

app.use(bodyParser.urlencoded({
    limit: "20mb",
    extended: true
}));

app.use(bodyParser.json({ limit: "20mb" }));

app.use('/api',
    sessions);

app.use('/api/res',
    CRUDapi,
    fileApi);





app.listen(parseInt(port),
    () => console.log(`listening on port ${port}!`)
)