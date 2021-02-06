import { BookmarkSettings } from "../../services/Bookmark";


export interface IPanelSubscription {
  from: BookmarkSettings;
  to: BookmarkSettings;
}
