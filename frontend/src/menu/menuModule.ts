import {MenuController} from "./MenuController";
import {RouteConfiguration} from "../interfaces";
import {menuView} from "./menuView";
import "./menu.css!css";
import {TokenService} from "../TokenService";

export function menuModule(route: RouteConfiguration, tokenService: TokenService) {
    return {
        controller: function() {
            return new MenuController(route, tokenService);
        },
        view: menuView
    };
}
