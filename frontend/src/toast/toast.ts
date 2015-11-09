///<reference path="../../../mithril.d.ts"/>
import * as m from "mithril";
import {LayoutConfiguration} from "../interfaces";
import {Toast, ToastLevel, ToastService} from "./ToastService";
import "./toast.css!css";

class ToastController {
    constructor(public config: LayoutConfiguration, public service: ToastService) {

    }
}

function toastView(ctrl: ToastController) {
    return m("div", {id: ctrl.config.toastId, "class": "toast-container" }, ctrl.service.toasts.map(renderToast));
}

function renderToast(toast: Toast) {
    return m(".toast", { "class": levelToClass(toast.level)}, toast.message);
}

function levelToClass(level: ToastLevel) {
    return ToastLevel[level].toLowerCase();
}

export function toast(config: LayoutConfiguration, service: ToastService) {
    return {
        controller: function() {
            return new ToastController(config, service);
        },
        view: toastView
    };
}

