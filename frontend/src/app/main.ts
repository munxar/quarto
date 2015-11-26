///<reference path="../../../mithril.d.ts"/>
import * as m from "mithril";
import {LoggerService} from "./service/LoggerService";
import {RouterService} from "./service/RouterService";
import {StorageService} from "./service/StorageService";
import {AuthService} from "./service/AuthService";
import {SocketService} from "./service/SocketService";
import {chat} from "./chat/chat";
import {login} from "./login/login";
import {signup} from "./signup/signup";
import {toast} from "./toast/toast";

// instantiate services
var logger = new LoggerService();
var router = new RouterService();
var storage = new StorageService();
var auth = new AuthService(storage);
var socket = new SocketService(auth);

// todo: remove console log
logger.on((msg, type) => console.log("%s %s", msg, type));

m.render(document.body,
    m(".container", [
        m("#toast"),
        m("#content")
    ])
);

m.mount(document.getElementById("toast"), toast(logger));

// use hashtag for routing
m.route.mode = "hash";

// mount routes
m.route(document.getElementById("content"), "/chat", {
    "/chat": chat(logger, socket, router, auth),
    "/login": login(logger, auth, router),
    "/signup": signup(logger, auth, router)
});

logger.info("welcome to chat");