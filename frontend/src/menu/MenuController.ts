///<reference path="../../../mithril.d.ts"/>
import * as m from "mithril";
import {MenuItem} from "./MenuItem";
import {RouteConfiguration} from "../interfaces";
import {TokenService} from "../TokenService";

export class MenuController {
    items:MenuItem[];

    constructor(route:RouteConfiguration, private tokenService: TokenService) {
        this.items = [
            new MenuItem(route.home, "home"),
            new MenuItem("/chat", "chat", () => tokenService.getToken()),
            new MenuItem(route.about, "about"),
            new MenuItem(route.login, "login", () => !tokenService.getToken()),
            new MenuItem("/logout", "logout", () => tokenService.getToken())
        ];
    }

    routeTo(item: MenuItem) {
        m.route(item.href);
    }


}
