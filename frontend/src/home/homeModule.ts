import {homeView} from "./homeView";
import {HomeController} from "./HomeController";

export function homeModule(args?: any) {
    return {
        controller: function() {
            return new HomeController(args.logger, args.tokenService);
        },
        view: homeView
    };
}