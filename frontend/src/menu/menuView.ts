///<reference path="../../../mithril.d.ts"/>
import * as m from "mithril";
import {MenuController} from "./MenuController";
import {MenuItem} from "./MenuItem";

export function menuView(ctrl: MenuController) {
    return [
        m(".logo", "chat!"),
        m(".account", "account")
    ];
}
