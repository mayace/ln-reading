import { FeedItem } from "../components/explorer/Feed";
import { KeywordSettings } from "../models/Settings";
import { Subscription } from "../models/Subscription";
import { IService, ICrudLikeService } from "./IService";


export abstract class LocalStorageCrudService<T> implements ICrudLikeService<T>{

    private data: T[] = []
    subscription = new Subscription<T[]>();

    constructor(private key: string) {
        this.data = this.readData(key);
        this.subscription.subscribe({
            next: context => {
                this.writeData(context);
            }
        })
    }


    abstract itemComparator(id: string, item: T): boolean;

    writeData(data: unknown): void {
        window.localStorage.setItem(this.key, JSON.stringify(data));
    }
    readData(key: string): T[] {
        const saved = window.localStorage.getItem(key)?.trim() || "";
        return saved.length > 0 ? JSON.parse(saved) : []
    }

    get(id: string): Promise<T | undefined> {
        return new Promise(resolve => resolve(this.data.find(item => this.itemComparator(id, item))))
    }
    getAll(selector?: (item: T) => boolean): Promise<T[]> {
        return new Promise(resolve => {
            resolve(selector ? this.data.filter(selector) : this.data)
        })
    }

    create(item: T): Promise<string> {
        return new Promise(resolve => {
            //todo: validate existins
            // this.generateId(item)
            this.data.push(item);
            resolve("done?");
            this.subscription.notifyAll(this.data);
        })
    }

    update(id: string, item: T): Promise<number> {
        return new Promise(resolve => {
            const index = this.getItemIndex(id);
            if (index >= 0) {
                const oldOne = this.data[index];
                this.data[index] = { ...oldOne, ...item };
            }
            resolve(index);
            this.subscription.notifyAll(this.data);
        })
    }
    delete(id: string): Promise<number> {
        return new Promise(resolve => {
            const index = this.getItemIndex(id);
            let affected = [];
            if (index >= 0) {
                affected = this.data.splice(index, 1)
            }
            resolve(affected.length);
            this.subscription.notifyAll(this.data);
        })
    }

    private getItemIndex(id: string): number {
        return this.data.findIndex(jtem => this.itemComparator(id, jtem));
    }

}

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


export class KeywordLocalStorageCrudService extends LocalStorageCrudService<KeywordSettings>{
    itemComparator(id: string, item: KeywordSettings): boolean {
        return id === item.text;
    }
}

export class FeedItemLocalStorageCrudService extends LocalStorageCrudService<FeedItem>{
    itemComparator(id: string, item: FeedItem): boolean {
        return id === item.guid;
    }
}