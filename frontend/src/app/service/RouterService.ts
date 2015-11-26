///<reference path="../../../../mithril.d.ts"/>
import * as m from "mithril";

export class RouterService {
    chat() {
        m.route("/chat");
    }

    login() {
        m.route("/login");
    }

}