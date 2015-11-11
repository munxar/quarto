import {TokenService} from "../TokenService";

export class AuthService {
    loggedIn = false;
    constructor(private tokenService: TokenService) {

    }

    tokenLogin(fn) {
        fn();
    }

    login() {
        this.loggedIn = true;
    }

    isLoggedIn(): boolean {
        return this.loggedIn;
    }
}
