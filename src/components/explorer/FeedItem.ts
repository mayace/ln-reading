import { IFeedItemInfo } from "./IFeedItemInfo";
import { IReadingKeywordItem } from "./IReadingKeywordItem";


export class FeedItem implements IFeedItemInfo {
    contentSnippet = "";
    title = "";
    description = "";
    link = "";
    isoDate = "";
    //becames the contentKey where is stored
    content = "";
    guid = "";
    isPinned = false;
    views = 0;
    createdAt = new Date();
    keywordList: IReadingKeywordItem[] = [];
}
