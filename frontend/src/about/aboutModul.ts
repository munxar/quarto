import {AboutController} from "./AboutController";
import {aboutView} from "./aboutView";

export function aboutModule(args?: any) {
    return {
        controller: AboutController,
        view: aboutView
    };
}
