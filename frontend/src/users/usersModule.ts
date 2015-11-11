///<reference path="../../../mithril.d.ts"/>
import * as m from "mithril";

class UsersController {
    users: any[] = [];
    constructor(private socket) {
        socket.on("users.list", users => {
            this.users = users;
            m.redraw();
        });
    }
}

export function usersModule(socket) {
    return {
        controller: function() {
            return new UsersController(socket);
        },
        view: function(ctrl: UsersController) {
            return m("div", [
                m("h1", "users"),
                m(".users-list", ctrl.users.map(user => m(".user", user.name)))
            ])
        }
    };
}
