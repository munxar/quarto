///<reference path="../../../typings/tsd.d.ts"/>
import * as m from "mithril";
import {min} from "../util/validation";
import {Logger} from "../interfaces";
import {TokenService} from "../TokenService";
import {UserPassViewModel, userPassForm} from "../login";

export function signupModule(args:{logger: Logger, tokenService: TokenService}) {
    return {
        controller: function() {
            return new SignupController(args.logger, args.tokenService)
        },
        view: signupView
    }
}

class SignupController {
    vm = new UserPassViewModel();

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


function signupView(ctrl:SignupController) {
    return m("div", [
        m("h1", "signup"),
        userPassForm(ctrl.vm, ctrl.signup, "signup"),
        m("a", {href:"#/login"}, "login")
    ]);
}
