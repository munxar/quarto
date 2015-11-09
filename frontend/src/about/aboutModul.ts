import {AboutController} from "./AboutController";
import {aboutView} from "./aboutView";
import "./about.css!css";

export function aboutModule(args?: any) {
    return {
        controller: AboutController,
        view: aboutView
    };
}
