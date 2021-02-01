import { BookmarkSettings } from "../../services/Bookmark";
import { IFeedItemInfo } from "./Feed";


export class ExplorerComponentState {
  feedList: IFeedItemInfo[] = [];
  feedUrlList: string[] = [];
  selectedFeedItem: IFeedItemInfo | null = null;
  bookmarkSettings = new BookmarkSettings();
}
