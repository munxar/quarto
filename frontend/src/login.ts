///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../../mithril.d.ts"/>
import * as m from "mithril";
import {ToastService, ToastLevel} from "./toast/ToastService";
import Socket = SocketIOClient.Socket;
import {min} from "./util/validation";
import {TokenService} from "./TokenService";
import {Logger} from "./interfaces";

export class UserPassViewModel {
    username = m.prop("");
    password = m.prop("");

    isValid() {
        return min(this.username())
            && min(this.password());
    }
}

class LoginController {
    vm = new UserPassViewModel();

    constructor(private logger:Logger, private tokenService:TokenService) {

    }

    login = (e) => {
        e.preventDefault();
        if (this.vm.isValid()) {
            m.request({url: "/api/login", method: "POST", data: this.vm}).then(this.onSuccess, this.onError);
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
        userPassForm(ctrl.vm, ctrl.login, "login"),
        m("a.signup", {href: "#/signup"}, "signup")
    ];
}

export function userPassForm(vm, onsubmit, name) {
    return m("form", {"class": "login-form", onsubmit}, [
        m("input", {
            type: "text",
            placeholder: "username",
            oninput: m.withAttr("value", vm.username),
            value: vm.username(),
            autofocus: true
        }),
        m("input", {
            type: "password",
            placeholder: "password",
            oninput: m.withAttr("value", vm.password),
            value: vm.password()
        }),
        m("button.btn", {type: "submit", disabled: !vm.isValid()}, name)
    ]);
}

export function login(logger:Logger, tokenService:TokenService) {
    return {
        controller: function () {
            return new LoginController(logger, tokenService);
        },
        view: loginView
    };
}
