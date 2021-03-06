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
                    return generateToken(user, res);
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

                return generateToken(user, res);
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

    function generateToken(user, res) {
        var payload = {
            id: user._id
        };
        var token = jwt.sign(payload, "1234", <any>{expiresIn: 24*60*60});

        delete user.password;

        return res.json({token, user});
    }

    return api;
}


