///<reference path="../../../mithril.d.ts"/>
import * as m from "mithril";

interface Info {
    message: string;
    version: string;
}

export class AboutController {
    info: Info;

    constructor() {
        m.request<Info>({ method: "GET", url: "/api" }).then(res => this.info = res);
    }
}