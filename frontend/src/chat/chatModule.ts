///<reference path="../../../typings/tsd.d.ts"/>
import * as m from "mithril";
import * as io from "socket.io-client";
import {TokenService} from "../TokenService";
import {Logger} from "../interfaces";
import "./chat.css!css";

export function chatModule(args?:any) {
    return {
        controller: function () {
            return new ChatController(args.tokenService, args.logger);
        },
        view: function (ctrl:ChatController) {
            return [
                m("h1", "chat"),
                m(".user-list", ctrl.vm.users.map(renderUser, ctrl)),
                m("div", ctrl.vm.messages.map(renderMessage, ctrl)),
                m("form.form", {onsubmit: ctrl.send}, [
                    m("input.input", {oninput: m.withAttr("value", ctrl.vm.input), value: ctrl.vm.input()}),
                    m("button.send", "send")
                ])
            ];
        }
    };
}

function renderMessage(message) {
    return m(".message-container", [
         m("img[src='http://s3.amazonaws.com/37assets/svn/765-default-avatar.png'][height='50px'][width='50px']"),
        m(".timestamp", toTime(message.timestamp)),
        m(".user", message.username),
        m(".message", message.message),
    ]);
}

function toTime(date: string) {
    var bla = new Date(date);
    return bla.getHours() + ":" + bla.getMinutes() + ":" + bla.getSeconds();
}

function renderUser(user) {
    return m("div", [
        m("div", {"class": user.status}, user.username)
    ]);
}

class ChatViewModel {
    input = m.prop("");
    messages = [];
    users = [];
}

class ChatController {
    socket;
    vm = new ChatViewModel();

    constructor(private tokenService:TokenService, private logger:Logger) {
        var token = tokenService.getToken();

        this.socket = io({query: "token=" + token, forceNew: true});

        this.socket.on("error", err => {
            console.log(err);
            if (err) {
                this.logger.error("unauthorized!");
                tokenService.removeToken();
                m.route("/login");
            }
        });

        this.socket.on("connect", function () {
            console.log("chat");
        });

        this.socket.on("send message", message => {
            this.vm.messages.push(message);
            m.redraw();
        });

        this.socket.on("update users", users => {
            this.vm.users = users;
            m.redraw();
        })
    }

    send = e => {
        e.preventDefault();
        this.socket.emit("send message", this.vm.input());
        this.vm.input("");
    };

    onunload() {
        this.socket.disconnect();
        console.log("unload");
    }
}
