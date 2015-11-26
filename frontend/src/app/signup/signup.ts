///<reference path="../../../../mithril.d.ts"/>
import * as m from "mithril";
import {UsernamePasswordViewModel, usernamePasswordForm} from "../controls/usernamePassword";
import {LoggerService} from "../service/LoggerService";
import {AuthService} from "../service/AuthService";
import {RouterService} from "../service/RouterService";

export function signup(logger: LoggerService, auth: AuthService, router: RouterService) {
    return {
        controller: function() {
            return new SignupController(logger, auth, router);
        },
        view: signupView
    }
}

class SignupController {
    vm = new UsernamePasswordViewModel();

    constructor(private logger: LoggerService, private auth: AuthService, private router: RouterService) {

    }

    signup = (e) => {
        e.preventDefault();

        if (this.vm.isValid()) {
            this.auth.signup(this.vm.username(), this.vm.password())
                .then(this.onSuccess, this.onError);
        }
    };

    onSuccess = res => {
        this.logger.success("signup success");
        this.router.chat();
    };

    onError = (res:Error) => {
        this.vm.password("");
        this.logger.warning(res.message);
    }
}

function signupView(ctrl: SignupController) {
    return [
        m("h1", "signup"),
        usernamePasswordForm(ctrl.vm, ctrl.signup, "signup"),
        m("a", {href: "#/login"}, "login")
    ];
}
