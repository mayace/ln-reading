import { BookmarkSettings } from "./Bookmark";
import { LocalStorageService } from "./LocalStorageService";


export class BookmarkLocalStorageService extends LocalStorageService<BookmarkSettings> {
    createInstance(): BookmarkSettings {
        return new BookmarkSettings();
    }
}
