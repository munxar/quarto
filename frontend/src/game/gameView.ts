///<reference path="../../../mithril.d.ts"/>
import * as m from "mithril";
import {GameController} from "./GameController";

export function gameView(ctrl: GameController) {
    return [
        m("h1", "game")
    ];
}
