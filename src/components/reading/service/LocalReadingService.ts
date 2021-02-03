import { KeywordSettings } from "../../../models/Settings";
import { BookmarkSettings } from "../../../services/Bookmark";
import { ICrudLikeService, IService } from "../../../services/IService";
import { FeedItem } from "../../explorer/Feed";
import { ReadingSettings } from "../ReadingSettings";
import { IReadingService } from "./IReadingService";

export class LocalReadingService implements IReadingService {
  constructor(
    public keywordService: ICrudLikeService<KeywordSettings>,
    public feedItemService: ICrudLikeService<FeedItem>,
    public settingsService: ICrudLikeService<ReadingSettings>,
    public bookmarkService: IService<BookmarkSettings>,
  ) {}
  getKeywordList(feedItemId: string): Promise<KeywordSettings[]> {
    return this.feedItemService.get(feedItemId).then((item) => {
      if (item) {
        return this.keywordService.getAll((jtem: KeywordSettings) =>
          item.keywordList.find((ktem) => ktem.keywordId === jtem.id),
        );
      }

      return [];
    });
  }
}
