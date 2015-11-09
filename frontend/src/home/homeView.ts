///<reference path="../../../mithril.d.ts"/>
import * as m from "mithril";
import {HomeController} from "./HomeController";

export function homeView(ctrl: HomeController) {
    return m("h1.test", ctrl.message);
}