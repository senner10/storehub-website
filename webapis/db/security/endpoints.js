const jwt = require('jsonwebtoken');
const JWTKey = "shhh";
const NoAccess = {"error" : "unauthorized request."};


var VerifyRequest = (req) => {
    //req.header(name)
    if (req.method == "OPTIONS") {
        delete req.body;
        delete req.query;
        return true;
    }

    var jwttoken = req.header("JWT-TOKEN");

    if (req.session && req.session.token) {
        jwttoken = req.session.token;
    }


    try {
        var decoded = jwt.verify(jwttoken, JWTKey);

        if (!decoded.userid)
            return false;

        req.owner = decoded.userid;

        req.verified = decoded.verified;
        return true;

    } catch (err) {
        // err
        console.log(err);
        return false;
    }

}

var Authenticator = (req, res, next) => {

    if (VerifyRequest(req)) {
        next() // pass control to the next handler
    } else {
        res.status(401).json(NoAccess);
    }
}

module.exports = Authenticator;