import { KeywordSettings } from "../../../models/Settings";
import { ICrudLikeService } from "../../../services/IService";
import { FeedItem } from "../../explorer/Feed";
import { ReadingSettings } from "../ReadingSettings";

export interface ILearningService {
  keywordService: ICrudLikeService<KeywordSettings>;
  feedItemService: ICrudLikeService<FeedItem>;
  settingsService: ICrudLikeService<ReadingSettings>;

  getKeywordList(feedItemId: string): Promise<KeywordSettings[]>;
}

export class LocalLearningService implements ILearningService {
  constructor(
    public keywordService: ICrudLikeService<KeywordSettings>,
    public feedItemService: ICrudLikeService<FeedItem>,
    public settingsService: ICrudLikeService<ReadingSettings>,
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
