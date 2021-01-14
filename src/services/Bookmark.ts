
export class FeedItem {
    guid= ""
    isPinned = false
    views = 0
    isoDate: Date = new Date()
    createdAt = new Date()
    contentKey = ""
    keywordListKey = ""
}

export class BookmarkSettings {
    sortMode = ""
    viewMode = ""
    dateMode = ""

    FeedItemList: FeedItem[] = []
}

export interface IService<T> {
    read(): Promise<T>
    save(item: T): void;
}

export class BookmarkLocalStorageService implements IService<BookmarkSettings> {

    private key: string
    constructor(key: string) {
        this.key = key;
    }

    async read(): Promise<BookmarkSettings> {
        const saved = window.localStorage.getItem(this.key)?.trim() || "";
        return new Promise(resolve => resolve(saved.length > 0 ? JSON.parse(saved) : new BookmarkSettings()))
    }

    save(item: BookmarkSettings): void {
        window.localStorage.setItem(this.key, JSON.stringify(item));
    }
}