///<reference path="../../../mithril.d.ts"/>
import * as m from "mithril";
import {MenuController} from "./MenuController";
import {MenuItem} from "./MenuItem";

export function menuView(ctrl: MenuController) {
    return m(".menu", ctrl.items.filter(item => item.isVisible()).map(renderMenuItem, ctrl));
}

function renderMenuItem(item: MenuItem) {
    return m(".menu-item", m("a", {
        "class": m.route() == item.href ? "active": "",
        onclick: e => this.routeTo(item)
    }, item.title));
}
