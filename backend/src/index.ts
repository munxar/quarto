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
    users.push({ id: socket.id, username: socket.decoded_token.username, status: "online" });

    io.emit("update users", users);

    socket.broadcast.emit("send message", { username: "system", message: socket.decoded_token.username + " entered the channel", timestamp: new Date()});

    socket.on("disconnect", function () {
        console.log("disconnect %s", socket.id);
        var user = users.filter(user => user.id == socket.id)[0];
        if(user) {
            var idx = users.indexOf(user);
            users.splice(idx, 1);
        }
        io.emit("update users", users);
        socket.broadcast.emit("send message", { username: "system", message: socket.decoded_token.username + " left the channel", timestamp: new Date()});
    });

    socket.on("send message", function(message) {
        console.log(message);

        // command message
        if(message.charAt(0) == "/") {
            var tokens = message.split(" ");
            socket.emit("send message", { username: "system", message: "command: " + tokens[0], timestamp: new Date()});
        } else { // normal message
            var msg = { username: socket.decoded_token.username, message: message, timestamp: new Date() };
            io.emit("send message", msg);
        }
    });

});

function commandRouter() {

}

server.listen(3000, function (err) {
    if (err) throw err;
    if (process.send) {
        process.send("ready");
    }
});
