///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../../mithril.d.ts"/>
import * as m from "mithril";
import {ToastService, ToastLevel} from "./toast/ToastService";
import Socket = SocketIOClient.Socket;
import {min} from "./util/validation";
import {TokenService} from "./TokenService";
import {Logger} from "./interfaces";

class LoginViewModel {
    username = m.prop("");
    password = m.prop("");

    isValid() {
        return min(this.username())
            && min(this.password());
    }
}

class LoginController {
    vm = new LoginViewModel();

    constructor(private logger:Logger, private tokenService: TokenService) {

    }

    login = (e) => {
        e.preventDefault();
        if (this.vm.isValid()) {
            m.request({ url: "/api/login", method: "POST", data: this.vm}).then(this.onSuccess, this.onError);
            this.vm.password("");
        }
    };

    onSuccess = res => {
        this.tokenService.setToken(res.token);
        this.logger.success("loggin success");
        m.route("/chat");
    };

    onError = (res:Error) => {
        this.vm.password("");
        this.logger.error(res.message);
    }
}

function loginView(ctrl:LoginController) {
    return [
        m("h1", "login"),
        m("form", {"class": "login-form", onsubmit: ctrl.login}, [
            formControll("username", ctrl.vm.username),
            formControll("password", ctrl.vm.password, "password"),
            [m("button.btn", {type: "submit", disabled: !ctrl.vm.isValid() }, "Login")]
        ])
    ];
}

function formControll(name:string, value, type = "text") {
    return m("div", {}, [
        m("input", {type, placeholder: name, id: name, oninput: m.withAttr("value", value), value: value() })
    ]);
}

export function login(logger: Logger, tokenService: TokenService) {
    return {
        controller: function () {
            return new LoginController(logger, tokenService);
        },
        view: loginView
    };
}
