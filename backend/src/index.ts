///<reference path="../../typings/tsd.d.ts"/>
import * as express from "express";
import * as http from "http";
import {json} from "body-parser";
import {join} from "path";
import {api} from "./api";
import * as socketio from "socket.io";
var socketioJwt = require("socketio-jwt");

var app = express();

app.use(express.static(join(__dirname, "../../frontend")));

app.use(json());
app.use("/api", api);

var server = http.createServer(app);
var io = socketio(server);

var opts = {secret: "1234", handshake: true};
io.use(socketioJwt.authorize(opts));

var users = [];

io.on("connection", function (socket:any) {
    console.log(socket.decoded_token);
    users.push({ id: socket.id, username: socket.decoded_token.username});

    io.emit("update users", users);

    socket.on("disconnect", function () {
        console.log("disconnect %s", socket.id);
        var user = users.filter(user => user.id == socket.id)[0];
        if(user) {
            var idx = users.indexOf(user);
            users.splice(idx, 1);
        }
        io.emit("update users", users);
    });

    socket.on("send message", function(message) {
        console.log(message);
        var msg = { username: socket.decoded_token.username, message: message, timestamp: new Date() };
        io.emit("send message", msg);
    });

});

server.listen(3000, function (err) {
    if (err) throw err;
    if (process.send) {
        process.send("ready");
    }
});
