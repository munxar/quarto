///<reference path="../../../../mithril.d.ts"/>
import * as m from "mithril";
import {LoggerService} from "../service/LoggerService";
import {RouterService} from "../service/RouterService";
import {SocketService} from "../service/SocketService";
import {AuthService} from "../service/AuthService";

class ChatController {
    user;

    constructor(private logger:LoggerService, private socket:SocketService, private router:RouterService, public auth: AuthService) {
        // connect to backend
        socket.connect()
            .then(this.onConnectSuccess, this.onConnectError);
    }

    onConnectSuccess = () => {
        this.user = this.auth.getUser();
        // async operation, we have to tell mithril to redraw
        m.redraw();
    };

    onConnectError = err => {
        this.logger.warning("not authenticated");
        this.router.login();
    };

    logout = () => {
        this.auth.logout();
        this.logger.success("logout success");
        this.router.login();
    };
}

function chatView(ctrl:ChatController) {
    return m("div", [
        header(ctrl),
        m("h1", "chat")
    ]);
}

export function chat(logger:LoggerService, socket:SocketService, router:RouterService, auth: AuthService) {
    return {
        view: chatView,
        controller: function () {
            return new ChatController(logger, socket, router, auth);
        }
    };
}

// header view
function header(ctrl: ChatController) {
    return m(".header", [
        m(".logo", "chat"),
        m(".user", ctrl.user ? ctrl.user.username : ""),
        m(".logout", {onclick: ctrl.logout}, "logout")
    ]);
}
