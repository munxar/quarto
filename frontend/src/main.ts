///<reference path="../../mithril.d.ts"/>
import * as m from "mithril";
import {configure} from "./configure";
import {login} from "./login";
import {layout} from "./layout";
import {AppConfiguration} from "./interfaces";
import {ToastService} from "./toast/ToastService";
import {toast} from "./toast/toast";
import {socket} from "./socket";
import {menuModule} from "./menu/menuModule";
import {usersModule} from "./users/usersModule";
import {chatModule} from "./chat/chatModule";
import {signupModule} from "./signup/signupModule";
import "./main.css!css";
import "font-awesome";

import {TokenService} from "./TokenService";

// create configuration
var configuration = configure();

// initialize app
initialize(configuration);

function initialize(config:AppConfiguration) {
    var tokenService = new TokenService();

    m.route.mode = config.routeMode;

    // render layout into body
    m.render(document.body, layout(config.layout));

    var toastService = new ToastService();
    toastService.addToast("welcome!");

    // mount toast component
    m.mount(document.getElementById(config.layout.toastId), toast(config.layout, toastService));
    // menu
    m.mount(document.getElementById(config.layout.menuId), menuModule(config.route, tokenService));

    // route content
    var route = config.route;
    m.route(document.getElementById(config.layout.pageId), "/chat", {
        [route.login]: login(toastService, tokenService),
        ["/logout"]: logout(),
        ["/signup"]: signupModule({logger: toastService, tokenService}),
        ["/chat"]: chatModule({tokenService, logger: toastService})
    });

    function logout() {
        return {
            view: function(ctrl) { return m("div"); },
            controller: function() {
                tokenService.removeToken();
                m.route(route.login);
            }
        }
    }
}
