
export interface IService<T> {
    read(): Promise<T>;
    save(item: T): void;
}

export interface ICrudLikeService<T> {
    create(item: T): Promise<string>;
    get(id: string): Promise<T | undefined>;
    update(id: string, item: T): Promise<number>;
    delete(id: string): Promise<number>;
    getAll(selector?: unknown): Promise<T[]>;
}
