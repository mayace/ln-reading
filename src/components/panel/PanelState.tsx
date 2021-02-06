import { BookmarkSettings } from "../../services/Bookmark";
import { BookmarkLocalStorageService } from "../../services/BookmarkLocalStorageService";
import { IService } from "../../services/IService";
import { FeedItem } from "../explorer/FeedItem";
import { IPanelState } from "./IPanelState";

export class PanelState implements IPanelState {
  bookmarkSettings: BookmarkSettings = new BookmarkSettings();
  feedItemList: FeedItem[] = [];
}
