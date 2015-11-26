///<reference path="../../../../mithril.d.ts"/>
import * as m from "mithril";
import {LoggerService} from "./LoggerService";
import {StorageService} from "./StorageService";

const TOKEN_KEY = "chat.token";
const USER_KEY = "chat.user";

interface User {
    _id: string;
    username: string;
}

interface LoginResponse {
    token: string;
    user: User;
}

export class AuthService {

    constructor(private storage: StorageService) {

    }

    login(username: string, password: string) {
        return this.request(username, password, "/api/login");
    }

    signup(username: string, password: string) {
        return this.request(username, password, "/api/signup");
    }

    private request(username, password, path) {
        var def = m.deferred();

        m.request<LoginResponse>({url: path, method: "POST", data: {username, password}})
            .then(res => {
                this.setToken(res.token);
                this.setUser(res.user);
                def.resolve(res);
            }, err => {
                def.reject(err)
            });

        return def.promise;
    }

    logout() {
        this.storage.remove(TOKEN_KEY);
    }

    getToken() {
        return this.storage.get(TOKEN_KEY);
    }

    getUser(): User {
        var str = this.storage.get(USER_KEY);
        return str != undefined ? JSON.parse(str) : null;
    }

    private setToken(token: string) {
        this.storage.set(TOKEN_KEY, token);
    }

    private setUser(user: User) {
        this.storage.set(USER_KEY, JSON.stringify(user));
    }

}