import {homeView} from "./homeView";
import {HomeController} from "./HomeController";

export function homeModule(args?: any) {
    return {
        controller: HomeController,
        view: homeView
    };
}