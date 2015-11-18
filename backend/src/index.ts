///<reference path="../../typings/tsd.d.ts"/>
import * as express from "express";
import * as http from "http";
import {json} from "body-parser";
import {join} from "path";
import {api} from "./api";
import {MongoClient} from "mongodb";
import * as socketio from "socket.io";
var socketioJwt = require("socketio-jwt");

MongoClient.connect("mongodb://localhost/chat", function(err, db) {
    if(err) throw err;
    var app = express();

    app.use(express.static(join(__dirname, "../../frontend")));

    app.use(json());
    app.use("/api", api(db));

    var server = http.createServer(app);
    var io = socketio(server);

    initSocket(io, db);

    server.listen(3000, function (err) {
        if (err) throw err;
        if (process.send) {
            process.send("ready");
        }
    });
});

function initSocket(io, db) {
    var messages = db.collection("message");

    var opts = {secret: "1234", handshake: true};
    io.use(socketioJwt.authorize(opts));

    var users = [];

    io.on("connection", function (socket:any) {
        var token = socket.decoded_token;

        users.push({ id: socket.id, username: token.username, user_id: token.id, status: "online" });

        io.emit("update users", users);
        messages.find({}).sort({_id:-1}).limit(10).toArray().then(docs => {
            io.emit("update chat", docs.reverse());
        }, err => console.error(err));

        socket.broadcast.emit("send message", { username: "system", message: token.username + " entered the channel", timestamp: new Date()});

        socket.on("disconnect", function () {
            console.log("disconnect %s", socket.id);
            var user = users.filter(user => user.id == socket.id)[0];
            if(user) {
                var idx = users.indexOf(user);
                users.splice(idx, 1);
            }
            io.emit("update users", users);
            socket.broadcast.emit("send message", { username: "system", message: token.username + " left the channel", timestamp: new Date()});
        });

        socket.on("send message", function(message) {
            console.log(message);
            if(message == "") return;

            // command message
            if(message.charAt(0) == "/") {
                var tokens = message.split(" ");
                socket.emit("send message", { username: "system", message: "command: " + tokens[0], timestamp: new Date()});
            } else { // normal message
                var msg = { username: token.username, message: message, timestamp: new Date() };
                messages.insertOne(msg).then(doc => {
                    io.emit("send message", msg);
                }, err => {
                    console.error("saving message failed %s", err);
                });
            }
        });

    });

}
