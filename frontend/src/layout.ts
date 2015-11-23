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
                m("header.top-bar", {id: config.menuId}),
                m("section", [
                    m("aside", [
                        m(".menu", [
                            m("div", "groups"),
                            m("div", "users")
                        ])
                    ]),
                    m("main", [
                        m(".chat", [
                            m('.header', "#header"),
                            m("div", { id: config.usersId }),
                            m("div", { id: config.pageId })
                        ])
                    ])
                ])
            ]);
        }
    };
}
