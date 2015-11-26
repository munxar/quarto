///<reference path="../../../../mithril.d.ts"/>
import * as m from "mithril";
import * as io from "socket.io-client";
import {AuthService} from "./AuthService";
import {LoggerService} from "./LoggerService";

export class SocketService {
    socket;

    constructor(private auth:AuthService) {
    }

    connect() {
        // disconnect first, to prevent multiple connections per session
        this.disconnect();

        // create a promise
        var def = m.deferred();

        // get token
        var token = this.auth.getToken();

        // if token is present, try to connect with backend
        if (token !== undefined) {
            // establish token connection
            this.socket = io.connect({forceNew: true});

            // authentication error
            this.socket.on("unauthorized", err => {
                // logout use
                this.auth.logout();
                // reject promise
                def.reject(err);
            });

            // authentication successful
            this.socket.on("authenticated", res => {
                // resolve promise
                def.resolve(res);
            });

            // send the token to authenticate the connection
            this.socket.emit("authenticate", {token});

        } else {
            def.reject();
        }

        return def.promise;
    }

    disconnect() {
        // if we have a socket
        if (this.socket) {
            // disconnect
            this.socket.disconnect();
        }
    }
}