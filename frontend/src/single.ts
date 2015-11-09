///<reference path="../../mithril.d.ts"/>
import * as m from "mithril";

class SingleCtrl {}

function singleView(ctrl: SingleCtrl) {
    return [
        m("h1.bla", "single")
    ];
}

export function singleModule(args?: any) {
    return {
        controller: SingleCtrl,
        view: singleView
    };
}
