import {GameController} from "./GameController";
import {gameView} from "./gameView";

export function gameModule(args?: any) {
    return {
        controller: GameController,
        view: gameView
    };
}
