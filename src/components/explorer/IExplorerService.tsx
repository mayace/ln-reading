import { BookmarkSettings } from "../../services/Bookmark";
import { ICrudLikeService, IService } from "../../services/IService";
import { FeedItem } from "./FeedItem";


export interface IExplorerService {
  bookmarkService: IService<BookmarkSettings>;
  feedItemService: ICrudLikeService<FeedItem>;
}
