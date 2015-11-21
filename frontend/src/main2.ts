///<reference path="../../mithril.d.ts"/>
import * as m from "mithril";
import * as io from "socket.io-client";
import "./main2.css!";

interface LoginResponse {
    token: string;
    user: any;
}

class AuthService {
    user = null;
    constructor(private token: TokenService, private socket: SocketService) {

    }

    isAuthenticated() {
        return this.user != null;
    }

    login(data, onSuccess, onError) {
        m.request<LoginResponse>({url: "api/login", method: "POST", data})
            .then(res => {
                this.token.set(res.token);
                this.user = res.user;
                this.socket.connect(res.token, onSuccess, onError);
            }, err => {
                this.user = null;
                console.error(err);
            });
    }

    logout() {
        this.user = null;
        this.token.remove();
    }
}

const TOKEN_KEY = "toktok";
class TokenService {

    get() {
        return localStorage.getItem(TOKEN_KEY);
    }

    present() {
        return localStorage.getItem(TOKEN_KEY) !== undefined;
    }

    set(token) {
        localStorage.setItem(TOKEN_KEY, token);
    }

    remove() {
        localStorage.removeItem(TOKEN_KEY);
    }
}

class SocketService {
    socket;

    constructor() {}

    connect(token, onSuccess, onError) {
        this.socket = io({query: "token=" + token, forceNew: true});
        this.socket.on("error", onError);
        //this.socket.on("connect", () => {});
        this.socket.on("user", onSuccess);
    }
}

var token = new TokenService();
var socket = new SocketService();
var auth = new AuthService(token, socket);

m.route.mode = "hash";
m.route(document.body, "/chat", {
    "/login": login(auth),
    "/signup": signup(auth, socket),
    "/logout": logout(auth, socket),
    "/chat": chat(auth, socket),
    "/chat/:id": chat(auth, socket)
});

// if no token -> goto login page
var tok = token.get();
if(tok) {
    socket.connect(tok, user => {
        auth.user = user;
        //m.route("/chat");
        m.redraw();
    }, error => {
        auth.logout();
        m.route("/login");
    });
} else {
    m.route("/login");
}


function header(name, href = name) {
    return m(".header", [
        m("div", "chat"),
        m("div", auth.isAuthenticated() ? auth.user.username : ""),
        m("a", {href: "#/" + href}, name)
    ]);
}

function login(auth: AuthService) {
    class UserPassViewModel {
        username = m.prop("");
        password = m.prop("");
    }
    class LoginCtrl {
        vm = new UserPassViewModel();

        constructor(private auth: AuthService) {
        }

        login = e => {
            e.preventDefault();
            this.auth.login(this.vm, () => {
                m.route("/chat")
            }, () => {
                m.route("/login");
            });
        };
    }
    return {
        controller: function () {
            return new LoginCtrl(auth);
        },
        view: (ctrl:LoginCtrl) => [
            header("signup"),
            m("h1", "login"),
            m("form", {onsubmit: ctrl.login}, [
                m("input", {placeholder: "username", oninput: m.withAttr("value", ctrl.vm.username)}),
                m("input", {type: "password", placeholder: "password", oninput: m.withAttr("value", ctrl.vm.password)}),
                m("button", "login")
            ])
        ]
    };
}

function signup(auth: AuthService, socket: SocketService) {
    return {
        controller: () => {
        },
        view: ctrl => [
            header("login"),
            m("h1", "signup")
        ]
    };
}

function logout(auth: AuthService, socket: SocketService) {
    return {
        controller: () => {
            auth.logout();
            m.route("/login");
            socket.socket.disconnect();
        },
        view: ctrl => m("div")
    };
}

function chat(auth: AuthService, socket: SocketService) {
    return {
        controller: () => {
            console.log(m.route.param("id"));
        },
        view: ctrl => [
            header("logout"),
            m("h1", "chat")
        ]
    };
}
