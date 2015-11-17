///<reference path="../../mithril.d.ts"/>
import * as m from "mithril";
import {LayoutConfiguration} from "./interfaces";

export function layout(config:LayoutConfiguration) {
    return {
        view: function () {
            return m("div.content", {id: config.contentId}, [
                m("div", {id: config.toastId}),
                m("div", {id: config.menuId}),
                m("div", {id: "logout"}),
                m("main", [
                    m("div", {id: config.usersId}),
                    m("div", {id: config.pageId})
                ])
            ]);
        }
    };
}
