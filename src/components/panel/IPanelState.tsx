import { BookmarkSettings } from "../../services/Bookmark";
import { FeedItem } from "../explorer/FeedItem";


export interface IPanelState {
  bookmarkSettings: BookmarkSettings;
  feedItemList: FeedItem[];
}
