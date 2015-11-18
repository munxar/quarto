///<reference path="../../../mithril.d.ts"/>
import * as m from "mithril";
import {MenuItem} from "./MenuItem";
import {RouteConfiguration} from "../interfaces";
import {TokenService} from "../TokenService";

export class MenuController {

    constructor(route:RouteConfiguration, private tokenService: TokenService) {

    }

    isLoggedIn() {
        return this.tokenService.getToken() != null;
    }

    logout = () => {
        this.tokenService.removeToken();
        m.route("/login");
    };
}
