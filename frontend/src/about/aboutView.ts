///<reference path="../../../mithril.d.ts"/>
import * as m from "mithril";
import {AboutController} from "./AboutController";

export function aboutView(ctrl: AboutController) {
    var info = ctrl.info;
    return m("div", [
        m(".message", info.message),
        m(".version", info.version)
    ]);
}