///<reference path="../../typings/tsd.d.ts"/>
import * as io from "socket.io-client";

export function socket(): SocketIOClient.Socket {
    var sock = io.connect();

    sock.on("error", function(error) {
        console.log(error);
    });

    return sock;
}
