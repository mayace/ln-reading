import { KeywordSettings } from "../../models/Settings";
import { BookmarkSettings } from "../../services/Bookmark";
import { ICrudLikeService, IService } from "../../services/IService";
import { FeedItem } from "../explorer/Feed";


export interface IReadingProps {
  contentStorageKey: string;
  keywordService: ICrudLikeService<KeywordSettings>;
  bookmarkService: IService<BookmarkSettings>;
  feedItemService: ICrudLikeService<FeedItem>;
}
