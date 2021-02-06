import { BookmarkSettings } from "../../services/Bookmark";
import { ICrudLikeService, IService } from "../../services/IService";
import { FeedItem } from "../explorer/FeedItem";
import { IPanelService } from "./IPanelService";


export class LocalPanelService implements IPanelService {
  constructor(
    public feedItemService: ICrudLikeService<FeedItem>,
    public bookmarkService: IService<BookmarkSettings>
  ) { }
}
