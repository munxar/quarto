///<reference path="../../typings/tsd.d.ts"/>
import * as express from "express";
import * as jwt from "jsonwebtoken";

export var api = express.Router();

api.get("/", (req, res) => {
    res.json({message: "yada api", version: "1.0.0"});
});

var users = [
    {username: "hans", password: "1234"},
    {username: "dennis", password: "1234"},
    {username: "sascha", password: "1234"}
];

api.post("/login", (req, res) => {

    var user = users.filter(user => user.username == req.body.username)[0];
    if (user != null) {
        if(user.password != req.body.password) {
            return res.status(400).json({message: "password wrong"});
        } else {
            var profile = {
                username: user.username
            };

            var token = jwt.sign(profile, "1234", {expiresInMinutes: 60 * 5});

            return res.json({token: token});
        }
    } else {
        return res.status(400).json({message: "username wrong!"});
    }
});

api.post("/signup", (req, res) => {

    validate(req.body, function (result) {
        if (!result.isValid()) {
            return res.status(400).json({message: result.getMessage()});
        }
        users.push({username: req.body.username, password: req.body.password});

        var profile = {
            username: req.body.username
        };
        var token = jwt.sign(profile, "1234", {expiresInMinutes: 60 * 5});

        res.json({message: "signup success", token});
    });
});

function validate(obj:any, fn) {
    var result = new ValidationResult(true, "invalid")
    if (obj.username.length < 4) {
        result.valid = false;
        result.message = "username must be at least 4 chars long."
    }
    if (obj.password.length < 4) {
        result.valid = false;
        result.message = "password must be at least 4 chars long."
    }
    if(users.filter(user => user.username == obj.username).length > 0) {
        result.valid = false;
        result.message = "username not available";
    }

    fn(result);
}

class ValidationResult {
    constructor(public valid:boolean, public message:string) {
    }

    isValid() {
        return this.valid;
    }

    getMessage() {
        return this.message;
    }
}
