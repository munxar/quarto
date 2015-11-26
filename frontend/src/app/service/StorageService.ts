

export class StorageService {

    get(key) {
        return localStorage.getItem(key);
    }

    set(key, token) {
        localStorage.setItem(key, token);
    }

    remove(key) {
        localStorage.removeItem(key);
    }
}
