///<reference path="../../mithril.d.ts"/>
import * as m from "mithril";
import {LayoutConfiguration} from "./interfaces";
import "./layout.css!css";
import {menuModule} from "./menu/menuModule";
import {TokenService} from "./TokenService";

export function layout(config:LayoutConfiguration, tokenService: TokenService) {
    return {
        controller: function() {},
        view: function () {
            return m(".content", {id: config.contentId}, [
                m("div", {id: config.toastId}),
                m("header.nav", {id: config.menuId}, [
                    m(".logo.menu-item", "chat!"),
                    m(".account.menu-item", tokenService.getToken() ? m("div", { onclick: () => { tokenService.removeToken(); m.route("/login"); } }, "logout") : m("div"))
                ]),
                m("main", {id: config.pageId})
            ]);
        }
    };
}
