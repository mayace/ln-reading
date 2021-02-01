import { IService } from "./IService";


export abstract class LocalStorageService<T> implements IService<T> {

    private key: string;
    constructor(key: string) {
        this.key = key;
    }

    async read(): Promise<T> {
        const saved = window.localStorage.getItem(this.key)?.trim() || "";
        return new Promise(resolve => resolve(saved.length > 0 ? JSON.parse(saved) : this.createInstance()));
    }

    save(item: T): void {
        window.localStorage.setItem(this.key, JSON.stringify(item));
    }

    abstract createInstance(): T;
}


