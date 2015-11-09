///<reference path="../../../mithril.d.ts"/>
import * as m from "mithril";
import {MenuController} from "./MenuController";

export function menuView(ctrl: MenuController) {
    return m(".menu", ctrl.items.map(renderMenuItem, ctrl));
}

function renderMenuItem(item) {
    return m(".menu-item", m("a", {
        "class": m.route() == item.href ? "active": "",
        onclick: e => this.routeTo(item)
    }, item.title));
}
