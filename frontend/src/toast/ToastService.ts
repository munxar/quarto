///<reference path="../../../mithril.d.ts"/>
import * as m from "mithril";

export enum ToastLevel {
    TRACE,
    INFO,
    WARNING,
    SUCCESS,
    ERROR
}

export class Toast {
    constructor(public message: string, public level: ToastLevel) {

    }
}

export class ToastService {
    toasts: Toast[] = [];

    addToast(message: string, level = ToastLevel.TRACE) {
        var toast = new Toast(message, level);
        this.toasts.push(toast);
        setTimeout(() => {
            this.removeToast(toast);
            m.render(document.getElementById("toast"));
        }, 5000);
    }

    removeToast(toast: Toast) {
        var idx = this.toasts.indexOf(toast);
        this.toasts.splice(idx, 1);
    }
}
