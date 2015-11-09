///<reference path="../../mithril.d.ts"/>
import * as m from "mithril";
import {AppConfiguration} from "./interfaces";

export function configure(): AppConfiguration {
    return {
        routeMode: "hash",
        layout: {
            contentId: "content",
            menuId: "menu",
            usersId: "users",
            pageId: "page",
            toastId: "toast"
        },
        route: {
            home: "/",
            game: "/game",
            login: "/login",
            about: "/about"
        }
    };
}
