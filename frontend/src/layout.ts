///<reference path="../../mithril.d.ts"/>
import * as m from "mithril";
import {LayoutConfiguration} from "./interfaces";

export function layout(config:LayoutConfiguration) {
    return {
        view: function () {
            return m("div", {id: config.contentId}, [
                m("div", {id: config.toastId}),
                m("div", {id: config.menuId}),
                m("main", [
                    m("div", {id: config.usersId}),
                    m("div", {id: config.pageId})
                ])
            ]);
        }
    };
}
