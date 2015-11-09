///<reference path="../../mithril.d.ts"/>
import * as m from "mithril";
import {AppConfiguration} from "./interfaces";

export function configure(): AppConfiguration {
    return {
        routeMode: "hash",
        layout: {
            contentId: "content",
            menuId: "menu",
            pageId: "page",
            toastId: "toast"
        },
        route: {
            home: "/",
            single: "/single",
            multi: "/multi",
            login: "/login",
            about: "/about"
        }
    };
}
