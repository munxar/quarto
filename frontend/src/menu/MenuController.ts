///<reference path="../../../mithril.d.ts"/>
import * as m from "mithril";
import {MenuItem} from "./MenuItem";
import {RouteConfiguration} from "../interfaces";
import {TokenService} from "../TokenService";

export class MenuController {
    items:MenuItem[];

    constructor(route:RouteConfiguration, private tokenService: TokenService) {
        var visiblePublic = () => !tokenService.getToken();
        var visiblePrivate = () => tokenService.getToken();

        this.items = [
            new MenuItem(route.home, "home", visiblePrivate),
            new MenuItem("/chat", "chat", visiblePrivate),
            new MenuItem(route.about, "about", visiblePrivate),
            //new MenuItem(route.login, "login", visiblePublic),
            //new MenuItem("/signup", "signup", visiblePublic),
            new MenuItem("/logout", "logout", visiblePrivate)
        ];
    }

    routeTo(item: MenuItem) {
        m.route(item.href);
    }


}
