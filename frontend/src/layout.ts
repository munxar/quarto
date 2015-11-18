///<reference path="../../mithril.d.ts"/>
import * as m from "mithril";
import {LayoutConfiguration} from "./interfaces";
import "./layout.css!css";

export function layout(config:LayoutConfiguration) {
    return {
        view: function () {
            return m("div.content", {id: config.contentId}, [
                m("div", {id: config.toastId}),
                m("header", {id: config.menuId}),
                m("main", [
                    m("aside", [
                        m("div", "groups"),
                        m("div", "users")
                    ]),
                    m(".chat", [
                        m("section", { id: config.usersId }),
                        m("section", { id: config.pageId })
                    ])
                ])
            ]);
        }
    };
}
