///<reference path="../../../typings/tsd.d.ts"/>
import * as m from "mithril";
import {min} from "../util/validation";
import {Logger} from "../interfaces";
import {TokenService} from "../TokenService";

export function signupModule(args:{logger: Logger, tokenService: TokenService}) {
    return {
        controller: function() {
            return new SignupController(args.logger, args.tokenService)
        },
        view: signupView
    }
}

class SignupController {
    vm = new SignupViewModel();

    constructor(private logger: Logger, private tokenService: TokenService) {

    }

    signup = (e) => {
        e.preventDefault();
        if(this.vm.isValid()) {
            m.request({url: "/api/signup", method: "POST", data: this.vm}).then(this.onSuccess, this.onError);
        }
    };

    onSuccess = res => {
        this.tokenService.setToken(res.token);
        this.logger.success(res.message);
        m.route("/chat");
    };

    onError = res => {
        this.logger.error(res.message);
    };
}

class SignupViewModel {
    username = m.prop("");
    password = m.prop("");
    isValid() {
        return min(this.username())
            && min(this.password())
    }
}

function signupView(ctrl:SignupController) {
    return [
        m("h1", "signup"),
        m("form", {onsubmit: ctrl.signup}, [
            m("div", [
                m("label", "username"),
                m("input", {autofocus: true, oninput: m.withAttr("value", ctrl.vm.username), value: ctrl.vm.username()})
            ]),
            m("div", [
                m("label", "password"),
                m("input", {type: "password", oninput: m.withAttr("value", ctrl.vm.password), value: ctrl.vm.password()})
            ]),
            m("div", m("button", {type: "submit", disabled: !ctrl.vm.isValid()}, "Signup"))
        ]),
        m("a", {href:"#/login"}, "login")
    ];
}
