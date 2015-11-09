///<reference path="../../../mithril.d.ts"/>
import * as m from "mithril";
import {MenuItem} from "./MenuItem";
import {RouteConfiguration} from "../interfaces";

export class MenuController {
    items:MenuItem[];

    constructor(route:RouteConfiguration) {
        this.items = [
            new MenuItem(route.home, "home"),
            new MenuItem(route.game, "game"),
            new MenuItem(route.about, "about"),
            new MenuItem(route.login, "login")
        ];
    }

    routeTo(item: MenuItem) {
        m.route(item.href);
    }
}
