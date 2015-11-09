///<reference path="../../typings/tsd.d.ts"/>
import * as express from "express";
import * as jwt from "jsonwebtoken";

export var api = express.Router();

api.get("/", (req, res) => { res.json({ message: "quarto api", version: "1.0.0" }); });

api.post("/login", (req, res) => {
    if(req.body.username != "hans") {
        return res.status(400).json({message: "username / password wrong!"});
    } else {

        var profile = {
            first_name: "Hans",
            last_name: "Wurst",
            email: "hans@wurst.com"
        };

        var token = jwt.sign(profile, "1234", { expiresInMinutes: 60*5 });

        res.json({token: token});
    }

});