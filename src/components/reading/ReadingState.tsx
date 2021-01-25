import { KeywordSettings } from "../../models/Settings";
import { FeedItem } from "../explorer/Feed";
import { ReadingSettings } from "./ReadingSettings";

export class ReadingState {
  readingSettings = new ReadingSettings();
  feedItem?: FeedItem;
  keywordList: KeywordSettings[] = [];
  selectedText = "";
  selectedKeyword: KeywordSettings | null = null;
}
