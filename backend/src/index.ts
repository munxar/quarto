///<reference path="../../typings/tsd.d.ts"/>
import * as express from "express";
import * as http from "http";
import {json} from "body-parser";
import {join} from "path";
import {api} from "./api";
import {MongoClient, ObjectID} from "mongodb";
import * as socketio from "socket.io";
var socketioJwt = require("socketio-jwt");

// connect to db
MongoClient.connect("mongodb://localhost/chat", function(err, db) {
    if(err) throw err;

    // create express app
    var app = express();
    // server static files
    app.use(express.static(join(__dirname, "../../frontend")));
    // parse body as json
    app.use(json());
    // mount api
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
    var messages = db.collection("messages");
    var userCollection = db.collection("users");

    //var opts = {secret: "1234", handshake: true};
    //io.use(socketioJwt.authorize(opts));
    var users = [];

    io.on("connection", socketioJwt.authorize({
        secret: "1234",
        timeout: 15000 // 15 seconds to send the authentication message
    }));

    io.on("authenticated", function(socket:any) {
        var token = socket.decoded_token;
        console.log("connect %s", socket.id);
        console.log(token);

        //socket.emit("authenticated", {});

        users.push({ id: socket.id, username: token.username, user_id: token.id, status: "online" });

        userCollection.findOne({_id: new ObjectID(token.id) }).then(user => {
            delete user.password;
            socket.emit("user", user);
        });

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

        socket.on("send message", function(message: string) {
            if(message == "") return;
            var tokens = message.split(" ");
            var cmd = tokens[0];

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
