///<reference path="../../../typings/tsd.d.ts"/>
import * as m from "mithril";
import * as io from "socket.io-client";
import {TokenService} from "../TokenService";
import {Logger} from "../interfaces";

export function chatModule(args?:any) {
    return {
        controller: function() {
            return new ChatController(args.tokenService, args.logger);
        },
        view: function () {
            return m("h1", "chat");
        }
    };
}

class ChatController {
    socket;
    constructor(private tokenService: TokenService, private logger: Logger) {
        var token = tokenService.getToken();

        this.socket = io({query: "token=" + token, forceNew: true});

        this.socket.on("error", err => {
            console.log(err);
            if(err) {
                this.logger.error("unauthorized!");
                tokenService.removeToken();
                m.route("/login");
            }
        });

        this.socket.on("connect", function() {
            console.log("chat");
        });
    }

    onunload() {
        this.socket.disconnect();
        console.log("unload");
    }
}