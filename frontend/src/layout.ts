///<reference path="../../mithril.d.ts"/>
import * as m from "mithril";
import {LayoutConfiguration} from "./interfaces";
import "./layout.css!css";

export function layout(config:LayoutConfiguration) {
    return {
        view: function () {
            return m("div.content", {id: config.contentId}, [
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
