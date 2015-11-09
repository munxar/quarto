import {MenuController} from "./MenuController";
import {RouteConfiguration} from "../interfaces";
import {menuView} from "./menuView";
import "./menu.css!css";

export function menuModule(route: RouteConfiguration) {
    return {
        controller: function() {
            return new MenuController(route);
        },
        view: menuView
    };
}
