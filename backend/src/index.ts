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

io.on("connection", function (socket:any) {
    console.log(socket.decoded_token);

    socket.on("disconnect", function () {
        console.log("disconnect %s", socket.id);
    });
});

server.listen(3000, function (err) {
    if (err) throw err;
    if (process.send) {
        process.send("ready");
    }
});
