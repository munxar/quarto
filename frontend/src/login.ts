///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../../mithril.d.ts"/>
import * as m from "mithril";
import {ToastService, ToastLevel} from "./toast/ToastService";
import Socket = SocketIOClient.Socket;

class LoginViewModel {
    username = m.prop("");
    password = m.prop("");
}

class LoginController {
    vm = new LoginViewModel();

    constructor(private logger:ToastService, private socket: Socket) {

    }

    login = (e) => {
        m.request({method: "POST", url: "/api/login", data: this.vm })
            .then(this.onSucess, this.onError);
        e.preventDefault();
    };

    onSucess = (res) => {
        console.log(res);
        this.socket.emit("authenticate", res);

        this.logger.addToast("login success", ToastLevel.SUCCESS);
        m.route("/multi");
    };

    onError = (res:Error) => {
        this.vm.password("");
        this.logger.addToast(res.message, ToastLevel.ERROR);
    }
}

function loginView(ctrl:LoginController) {
    return [
        m("form", {"class": "login-form", onsubmit: ctrl.login}, [
            formControll("username", ctrl.vm.username),
            formControll("password", ctrl.vm.password, "password"),
            [m("button", {type: "submit"}, "Login")]
        ])
    ];
}

function formControll(name:string, value, type = "text") {
    return m("div", {}, [
        m("label", {"for": name}, name),
        m("input", {type, id: name, onchange: m.withAttr("value", value), value: value() })
    ]);
}

export function login(logger: ToastService, socket: Socket) {
    return {
        controller: function () {
            return new LoginController(logger, socket);
        },
        view: loginView
    };
}