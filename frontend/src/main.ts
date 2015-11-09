///<reference path="../../mithril.d.ts"/>
import * as m from "mithril";
import {configure} from "./configure";
import {homeModule} from "./home/homeModule";
import {singleModule} from "./single";
import {multi} from "./multi";
import {aboutModule} from "./about/aboutModul";
import {login} from "./login";
import {layout} from "./layout";
import {AppConfiguration} from "./interfaces";
import {ToastService} from "./toast/ToastService";
import {toast} from "./toast/toast";
import {socket} from "./socket";
import {menuModule} from "./menu/menuModule";
import {gameModule} from "./game/gameModule";
import "./main.css!css";
import MithrilRoutes = _mithril.MithrilRoutes;

// create configuration
var configuration = configure();

// initialize app
initialize(configuration);

function initialize(config:AppConfiguration) {
    m.route.mode = config.routeMode;

    // render layout into body
    m.render(document.body, layout(config.layout));

    // mount menu component
    m.mount(document.getElementById(config.layout.menuId), menuModule(config.route));

    var toastService = new ToastService();
    toastService.addToast("Welcome to Quarto!");

    // mount toast component
    m.mount(document.getElementById(config.layout.toastId), toast(config.layout, toastService));

    var sock = socket();
    var route = config.route;
    // route content
    m.route(document.getElementById(config.layout.pageId), route.home, <MithrilRoutes<any>> {
            [route.home]: homeModule(),
            [route.game]: gameModule(),
            [route.about]: aboutModule(),
            [route.login]: login(toastService, sock)
        });
}
