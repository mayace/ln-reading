import { ISubscriber } from "../../models/ISubscriber";
import { ISubscription, Subscription } from "../../models/Subscription";

import { at, Dictionary } from "lodash"
import { type } from "os";

export interface IDocument {
    key: string
    value: string
}

export interface ITable<T> {
    getAll(): Promise<T[]>;
    create(item: T): void;
    get(key: string): Promise<T | null | undefined>;
    delete(item: T): void;
    update(item: T): void;
    subscribe(item: ISubscriber<ITableDMLEvent<T>>): ISubscription;
}


export enum TableDMLEventType {
    created = 1,
    deleted = 2,
    updated = 3,
}

export interface ITableDMLEvent<T> {
    type: TableDMLEventType
    from: T
    to: T
}

type IComparator<T> = (item: T, value: unknown) => boolean

export class LocalStorageTable<T> implements ITable<T> {
    private data: T[] = []
    private key: string
    private db: IDatabase
    private subscription = new Subscription<ITableDMLEvent<T>>();
    private comparator: IComparator<T>;

    constructor(db: IDatabase, key: string, comparator: IComparator<T>) {
        this.key = key;
        this.db = db;
        this.comparator = comparator;
    }

    getAll(): Promise<T[]> {
        return new Promise((resolve) => resolve(this.data));
    }
    create(item: T): void {
        this.data.push(item);
        this.subscription.notifyAll({ from: item, to: item, type: TableDMLEventType.created });
    }
    get(id: string): Promise<T | null | undefined> {
        return new Promise(resolve => resolve(this.data.find(item => this.comparator(item, id))));
    }


    // private getId<T extends IDictio(comparator: string, item: T): void {

    //     if (item instanceof Object)
    //         for (const jtem of comparator.split(".")) {
    //             return item[jtem];
    //         }
    // }

    delete(item: T): void {
        const index = this.data.indexOf(item);
        if (index >= 0) {
            this.data.splice(index, 1);
            this.db.update(this.key, this);
            this.subscription.notifyAll({ from: item, to: item, type: TableDMLEventType.deleted });
        }
    }
    drop(): void {
        this.db.delete(this.key);
    }

    update(item: T): void {
        const index = this.data.indexOf(item);
        if (index >= 0) {
            this.data[index] = item;
            this.db.update(this.key, this);
            this.subscription.notifyAll({ from: item, to: item, type: TableDMLEventType.updated });
        }
    }
    subscribe(subscriber: ISubscriber<ITableDMLEvent<T>>): ISubscription {
        return this.subscription.subscribe(subscriber);
    }
}


export interface IDatabase {
    get<T>(objectName: string,): Promise<ITable<T>>;
    create<T>(objectName: string): Promise<ITable<T>>
    delete(objectName: string): Promise<number>
    update(objectName: string, item: ITable<unknown>): Promise<number>
}

export class LocalStorageDb implements IDatabase {
    get<T>(object: string): Promise<ITable<T>> {
        const saved = window.localStorage.getItem(object)?.trim() || "";
        return saved.length > 0 ? JSON.parse(saved) : undefined;
    }
    create<T>(object: string): Promise<ITable<T>> {
        const table: ITable<T> = new LocalStorageTable<T>(this, object, ()=> true);
        this.update(object, table);
        return new Promise(resolve => resolve(table));
    }
    delete(object: string): Promise<number> {
        window.localStorage.removeItem(object);
        return new Promise((resolve) => resolve(1));
    }
    update(object: string, item: ITable<unknown>): Promise<number> {
        window.localStorage.setItem(object, JSON.stringify(item));
        return new Promise((resolve) => resolve(1));
    }

}