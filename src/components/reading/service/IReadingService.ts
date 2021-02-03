import { KeywordSettings } from "../../../models/Settings";
import { BookmarkSettings } from "../../../services/Bookmark";
import { ICrudLikeService, IService } from "../../../services/IService";
import { FeedItem } from "../../explorer/Feed";
import { ReadingSettings } from "../ReadingSettings";


export interface IReadingService {
  keywordService: ICrudLikeService<KeywordSettings>;
  feedItemService: ICrudLikeService<FeedItem>;
  bookmarkService: IService<BookmarkSettings>;
  settingsService: ICrudLikeService<ReadingSettings>;

  getKeywordList(feedItemId: string): Promise<KeywordSettings[]>;
}
