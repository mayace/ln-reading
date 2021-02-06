import { BookmarkSettings } from "../../services/Bookmark";
import { IFeedItemExtras } from "./IFeedItemExtras";
import { IFeedItemInfo } from "./IFeedItemInfo";

export class ExplorerComponentState {
  feedList: (IFeedItemInfo & IFeedItemExtras)[] = [];
  feedUrlList: string[] = [];
  selectedFeedItem: (IFeedItemInfo & IFeedItemExtras) | null = null;
  bookmarkSettings = new BookmarkSettings();
}
