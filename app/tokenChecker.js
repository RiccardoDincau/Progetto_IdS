const jwt = require("jsonwebtoken");
const errResp = require("./errors/errorResponse.js");

const tokenChecker = function (req, res, next) {
    var token = req.headers["x-access-token"];

    if (!token) {
        errResp.tokenNotProvided(res);
        return;
    }

    // decode token, verifies secret and checks expiration
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) {
            errResp.invalidToken(res);
        } else {
            // if everything is good, save in req object for use in other routes
            req.loggedUser = decoded;
            next();
        }
    });
};

module.exports = tokenChecker;
