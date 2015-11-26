///<reference path="../../../../mithril.d.ts"/>
import * as m from "mithril";
import {LoggerService, LogLevel} from "../service/LoggerService";
import "./toast.css!css";

class Toast {
    constructor(public message: string, public level: LogLevel) {

    }
}

class ToastController {

    toasts: Toast[] = [];

    constructor(private logger: LoggerService) {
        logger.on((message, level) => this.addToast(message, level));
    }

    addToast(message: string, level: LogLevel) {
        var toast = new Toast(message, level);
        this.toasts.push(toast);
        setTimeout(() => {
            this.removeToast(toast);
            m.redraw();
        }, 5000);
    };

    removeToast(toast: Toast) {
        var idx = this.toasts.indexOf(toast);
        this.toasts.splice(idx, 1);
    };


}

function toastView(ctrl: ToastController) {
    return m(".toast-container", ctrl.toasts.map(renderToast));
}

function renderToast(toast: Toast) {
    return m(".toast", { "class": levelToClass(toast.level)}, toast.message);
}

function levelToClass(level: LogLevel) {
    return LogLevel[level].toLowerCase();
}

export function toast(logger: LoggerService) {
    return {
        controller: function() {
            return new ToastController(logger);
        },
        view: toastView
    };
}

