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
                m("aside", [
                    m(".menu", [
                        m("div", "groups"),
                        m(".group-list", ctrl.vm.groups.map(renderGroup)),
                        m("div", "Users"),
                        m(".user-list", ctrl.vm.users.map(renderUser))
                    ])
                ]),
                m(".conversation", ctrl.vm.messages.map(renderMessage, ctrl)),
                m("form.form", {onsubmit: ctrl.send}, [
                    m("input.input", {
                        oninput: m.withAttr("value", ctrl.vm.input),
                        value: ctrl.vm.input(),
                        autofocus: true
                    }),
                    //m("button.btn.send", "send")
                ])
            ];
        }
    };
}

function renderMessage(message) {
    return m(".message-container", [
        m(".user", message.username),
        m(".message", renderMessageText(message.message)),
        m("time.timestamp", toTime(message.timestamp)),
    ]);
}

function renderMessageText(text:string) {

    var result = text.replace(/:-\)/g, "<i class='fa fa-smile-o'>");
    result = result.replace(/;-\)/g, "<i class='fa fa-smile-o'>");
    result = result.replace(/:-\(/g, "<i class='fa fa-frown-o'>");
    result = result.replace(/\(cat\)/g, "<img class='img-icons' src='img/cat.gif'>");
    result = result.replace(/\(hack\)/g, "<img class='img-icons' src='img/hack.gif'>");

    return m("div", m.trust(result));
}

function toTime(date:string) {
    var bla = new Date(date);
    return bla.getHours() + ":" + bla.getMinutes() + ":" + bla.getSeconds();
}

function renderUser(user) {
    return m(".user", {"class": user.status}, user.username);
}

function renderGroup(group) {
    return m(".group", {"class": group.active ? "active" : ""}, group.name);
}

class ChatViewModel {
    input = m.prop("");
    messages = [];
    users = [];
    groups = [{name: "Alle", active: true}, {name: "Development", active: false}];
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

        });

        this.socket.on("send message", message => {
            this.vm.messages.push(message);
            m.redraw();
            this.scrollToBottom();
        });

        this.socket.on("update users", users => {
            this.vm.users = users;
            m.redraw();
        });

        this.socket.on("update chat", messages => {
            this.vm.messages = messages;
            m.redraw();
            // args ...
            setTimeout(() => {
                this.scrollToBottom();
            }, 50);
        })
    }

    send = e => {
        e.preventDefault();
        if (this.vm.input() != "") {
            this.socket.emit("send message", this.vm.input());
        }
        this.vm.input("");
    };

    onunload() {
        this.socket.disconnect();
    }

    scrollToBottom() {
        window.scrollTo(0, document.body.clientHeight);
    }
}
