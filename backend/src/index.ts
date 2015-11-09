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

var usernames = {};
//socketioJwt.authorize({secret: "1234", timeout: 15000 })).on('authenticated', function (socket)

io.on('connection',  function(socket) {
    //this socket is authenticated, we are good to handle more events from it.
    //console.log('hello! ' + JSON.stringify(socket.decoded_token));
    console.log('user %s connected', socket.id);

    socket.on("disconnect", function () {

        console.log("%s disconnected", socket.id);
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
