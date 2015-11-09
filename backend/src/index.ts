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

var users = [];

io.on("connection",  function(socket) {
    console.log("user %s connected", socket.id);

    users.push({ id: socket.id, name: "Gast" });

    io.sockets.emit("users.list", users);

    socket.on("disconnect", function () {
        console.log("%s disconnected", socket.id);
        var user = users.filter(user => user.id == socket.id)[0];
        var idx = users.indexOf(user);
        if(idx >= 0) {
            users.splice(idx, 1);
            io.sockets.emit("users.list", users);
        }
    });

    socket.on("msg", function (msg) {
        console.log(msg);
        io.emit("msg", msg);
    });
});

server.listen(3000, function(err) {
    if(err) throw err;
    if(process.send) {
        process.send("ready");
    }
});
