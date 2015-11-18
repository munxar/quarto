///<reference path="../../mithril.d.ts"/>
import * as m from "mithril";
import {LayoutConfiguration} from "./interfaces";

export function layout(config:LayoutConfiguration) {
    return {
        view: function () {
            return m("div.content", {id: config.contentId}, [
                m("div", {id: config.toastId}),
                m("header", {id: config.menuId}),
                m("div", {id: "logout"}),
                m("main", [
                    m("aside", [
                        m("ul", "Group", [
                            m("li", "deine Nase")
                        ])
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
