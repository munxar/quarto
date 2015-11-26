///<reference path="../../../../mithril.d.ts"/>
import * as m from "mithril";
import {UsernamePasswordViewModel, usernamePasswordForm} from "../controls/usernamePassword";
import {LoggerService} from "../service/LoggerService";
import {AuthService} from "../service/AuthService";
import {RouterService} from "../service/RouterService";

export function login(logger: LoggerService, auth: AuthService, router: RouterService) {
    return {
        controller: function() {
            return new LoginController(logger, auth, router);
        },
        view: loginView
    }
}

class LoginController {
    vm = new UsernamePasswordViewModel();

    constructor(private logger: LoggerService, private auth: AuthService, private router: RouterService) {

    }

    login = (e) => {
        e.preventDefault();

        if (this.vm.isValid()) {
            this.auth.login(this.vm.username(), this.vm.password())
                .then(this.onSuccess, this.onError);
        }
    };

    onSuccess = res => {
        this.logger.success("login success");
        this.router.chat();
    };

    onError = (res:Error) => {
        this.vm.password("");
        this.logger.error(res.message);
    }
}


function loginView(ctrl: LoginController) {
    return [
        m("h1", "login"),
        usernamePasswordForm(ctrl.vm, ctrl.login, "login"),
        m("a", {href: "#/signup"}, "signup")
    ];
}