/////<reference path="../../mithril.d.ts"/>
//import * as m from "mithril";
//import {configure} from "./configure";
//import {login} from "./login";
//import {layout} from "./layout";
//import {AppConfiguration} from "./interfaces";
//import {ToastService} from "./toast/ToastService";
//import {toast} from "./toast/toast";
//import {socket} from "./socket";
//import {usersModule} from "./users/usersModule";
//import {chatModule} from "./chat/chatModule";
//import {signupModule} from "./signup/signupModule";
//import "./main.css!css";
//import "font-awesome";
//
//import {TokenService} from "./TokenService";
//import MithrilRoutes = _mithril.MithrilRoutes;
//import MithrilController = _mithril.MithrilController;
//
//// create configuration
//var config = configure();
//
//var tokenService = new TokenService();
//
//m.route.mode = config.routeMode;
//
//// render layout into body
//m.render(document.body, layout(config.layout, tokenService));
//
//var toastService = new ToastService();
//toastService.addToast("welcome!");
//
//// mount toast component
////m.mount(document.getElementById(config.layout.toastId), toast(config.layout, toastService));
//
//// route content
//var route = config.route;
//
//m.route(document.getElementById(config.layout.pageId), "/chat", <MithrilRoutes<MithrilController>>{
//    [route.login]: login(toastService, tokenService),
//    ["/signup"]: signupModule({logger: toastService, tokenService}),
//    ["/chat"]: chatModule({tokenService, logger: toastService}),
//    ["/chat/:id"]: chatModule({tokenService, logger: toastService})
//});
//
