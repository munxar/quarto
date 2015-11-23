///<reference path="../../../mithril.d.ts"/>
import * as m from "mithril";
import {MenuController} from "./MenuController";
import {MenuItem} from "./MenuItem";

export function menuView(ctrl: MenuController) {

    return [
        m(".logo.header-item", "chat!"),
        m(".account.header-item", "account")
    ];
}
