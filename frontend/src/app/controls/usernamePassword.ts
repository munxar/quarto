///<reference path="../../../../mithril.d.ts"/>
import * as m from "mithril";
import {min} from "../util/validation";

export class UsernamePasswordViewModel {
    username = m.prop("");
    password = m.prop("");

    isValid() {
        return min(this.username())
            && min(this.password());
    }
}

export function usernamePasswordForm(vm, onsubmit, name) {
    return m("form", {"class": "login-form", onsubmit}, [
        m("input", {
            type: "text",
            placeholder: "username",
            oninput: m.withAttr("value", vm.username),
            value: vm.username(),
            autofocus: true
        }),
        m("input", {
            type: "password",
            placeholder: "password",
            oninput: m.withAttr("value", vm.password),
            value: vm.password()
        }),
        m("button.btn", {type: "submit", disabled: !vm.isValid()}, name)
    ]);
}

