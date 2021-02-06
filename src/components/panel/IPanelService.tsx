import { BookmarkSettings } from "../../services/Bookmark";
import { ICrudLikeService, IService } from "../../services/IService";
import { FeedItem } from "../explorer/FeedItem";

export interface IPanelService {
  feedItemService: ICrudLikeService<FeedItem>;
  bookmarkService: IService<BookmarkSettings>;
}
