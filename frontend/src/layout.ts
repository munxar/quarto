///<reference path="../../mithril.d.ts"/>
import * as m from "mithril";
import {LayoutConfiguration} from "./interfaces";
import "./layout.css!css";

export function layout(config:LayoutConfiguration) {
    return {
        view: function () {
            return m("div.container", {id: config.contentId}, [
                m("header.top-bar", {id: config.menuId}),
                m("div", {id: config.toastId}),
                m('.blackbox', [
                    m("aside.sidebar", [
                        m(".menu", [
                            m("div", "groups"),
                            m("div", "users")
                        ])
                    ]),
                    m("main.content", [
                        m("section.chat", [
                            m('.header', "#header"),
                            m("div", { id: config.usersId }),
                            m(".room", { id: config.pageId })
                        ])
                    ])
                ])
            ]);
        }
    };
}
