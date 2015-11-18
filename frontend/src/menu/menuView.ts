///<reference path="../../../mithril.d.ts"/>
import * as m from "mithril";
import {MenuController} from "./MenuController";
import {MenuItem} from "./MenuItem";

export function menuView(ctrl: MenuController) {

    return [
        m(".logo.menu-item", "chat!"),
        m(".account.menu-item", ctrl.isLoggedIn() ? m("div", { onclick: ctrl.logout }, "logout") : m("div"))
    ];
}
