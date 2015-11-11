/**
 * Created by saschaaeppli on 10.11.15.
 */

const TOKEN_KEY = "token";

export class TokenService {

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    setToken(token: string) {
        localStorage.setItem(TOKEN_KEY, token);
    }

    removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    }
}