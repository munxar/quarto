///<reference path="../../../../mithril.d.ts"/>
import * as m from "mithril";
import {LoggerService} from "../service/LoggerService";
import {RouterService} from "../service/RouterService";
import {SocketService} from "../service/SocketService";
import {AuthService} from "../service/AuthService";
import "./chat.css!";

interface Channel {
    _id: string;
    name: string;
}

class ChatController {
    user;
    channels:Channel[] = [];
    messages:any[] = [];
    selectedChannel;

    constructor(private logger:LoggerService, private socket:SocketService, private router:RouterService, public auth:AuthService) {
        // connect to backend
        socket.connect()
            .then(this.onConnectSuccess, this.onConnectError);
    }

    onConnectSuccess = () => {
        this.user = this.auth.getUser();

        // initialize socket handling
        this.initSocket();

        // async operation, we have to tell mithril to redraw
        m.redraw();
    };

    onConnectError = err => {
        this.logger.warning("not authenticated");
        this.router.login();
    };

    // add event handlers
    initSocket() {
        this.socket.on("message.add", message => {
            this.messages.push(message);
        });

        this.socket.on("channel.add", channel => {
            this.channels.push(channel);
        });

        this.socket.on("channel.remove", id => {
            var channel = this.channels.filter(channel => channel._id == id)[0];
            var idx = this.channels.indexOf(channel);
            if (idx != -1) {
                this.channels.splice(idx, 1);
            }
        });
    }

    logout = () => {
        this.auth.logout();
        this.logger.success("logout success");
        this.router.login();
    };

    addChannel = () => {
        this.socket.emit("channel.add", "new channel");
    };

    removeChannel(channel) {
        this.socket.emit("channel.remove", channel._id);
    }

    selectChannel(channel) {
        this.selectedChannel = channel;
    }
}

function chatView(ctrl:ChatController) {
    return m("div", [
        header(ctrl),
        m("h1", "chat"),
        channels(ctrl)
    ]);
}

export function chat(logger:LoggerService, socket:SocketService, router:RouterService, auth:AuthService) {
    return {
        view: chatView,
        controller: function () {
            return new ChatController(logger, socket, router, auth);
        }
    };
}

// header view
function header(ctrl:ChatController) {
    return m(".header", [
        m(".logo", "chat"),
        m(".user", ctrl.user ? ctrl.user.username : ""),
        m(".logout", {onclick: ctrl.logout}, "logout")
    ]);
}

function channels(ctrl:ChatController) {
    return m(".channel-list", [
        m("h2", [
            m("span", "rooms"),
            m("button", {onclick: ctrl.addChannel}, "+")
        ]),
        ctrl.channels.map(renderChannel, ctrl)
    ]);
}

function renderChannel(channel:Channel) {
    return m(".channel", [
        m("span", {
            onclick: this.selectChannel.bind(this, channel),
            "class": this.selectedChannel == channel ? "selected" : ""
        }, channel.name),
        m("button", {onclick: this.removeChannel.bind(this, channel)}, "x")
    ]);
}