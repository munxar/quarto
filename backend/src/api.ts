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

        res.json({message: "ok"});
    });
});

function validate(obj:any, fn) {
    var valid = true;
    if (obj.username.length < 4) {
        valid = false;
    }
    if (obj.password.length < 4) {
        valid = false;
    }

    fn(new ValidationResult(valid, "username / password not valid"));
}

class ValidationResult {
    constructor(private valid:boolean, private message:string) {
    }

    isValid() {
        return this.valid;
    }

    getMessage() {
        return this.message;
    }
}
