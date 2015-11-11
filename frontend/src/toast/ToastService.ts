///<reference path="../../../mithril.d.ts"/>
import * as m from "mithril";
import {Logger} from "../interfaces";

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

export class ToastService implements Logger {

    toasts: Toast[] = [];

    addToast(message: string, level = ToastLevel.TRACE) {
        var toast = new Toast(message, level);
        this.toasts.push(toast);
        setTimeout(() => {
            this.removeToast(toast);
            m.redraw();
        }, 5000);
    }

    removeToast(toast: Toast) {
        var idx = this.toasts.indexOf(toast);
        this.toasts.splice(idx, 1);
    }

    error(message:string) {
        this.addToast(message, ToastLevel.ERROR)
    }

    success(message:string) {
        this.addToast(message, ToastLevel.SUCCESS)
    }
}
