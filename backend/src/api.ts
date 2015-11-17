///<reference path="../../typings/tsd.d.ts"/>
import * as express from "express";
import * as jwt from "jsonwebtoken";

export function api(db) {
    var api = express.Router();

    api.get("/", (req, res) => {
        res.json({message: "yada api", version: "1.0.0"});
    });

    var users = db.collection("users");

    api.post("/login", (req, res, next) => {
        users.findOne({username: req.body.username}).then(user => {
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
        }, next);
    });

    api.post("/signup", (req, res, next) => {

        validate(req.body, function (result) {
            if (!result.isValid()) {
                return res.status(400).json({message: result.getMessage()});
            }
            users.insertOne({username: req.body.username, password: req.body.password}).then((doc:any) => {
                var user = doc.ops[0];
                var profile = {
                    username: user.username
                };
                var token = jwt.sign(profile, "1234", {expiresInMinutes: 60 * 5});
                res.json({message: "signup success", token});
            }, next);
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
        users.findOne({username: obj.username}).then(user => {
            if(user != null) {
                result.valid = false;
                result.message = "username not available";
            }

            fn(result);
        });
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

    return api;
}


