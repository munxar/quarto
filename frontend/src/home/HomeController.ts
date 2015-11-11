///<reference path="../../../typings/tsd.d.ts"/>
import * as m from "mithril";

import {ToastService, ToastLevel} from "../toast/ToastService";
import {TokenService} from "../TokenService";


export class HomeController {
    message = "welcome to yada!";

    constructor(private logger: ToastService, private tokenService: TokenService) {

    }
}

