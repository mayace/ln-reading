import { BookmarkSettings } from "../../services/Bookmark";
import { IService, ICrudLikeService } from "../../services/IService";
import { FeedItem } from "./FeedItem";
import { IExplorerService } from "./IExplorerService";

export class LocalExplorerService implements IExplorerService {
  constructor(
    public bookmarkService: IService<BookmarkSettings>,
    public feedItemService: ICrudLikeService<FeedItem>,
  ) {}
}
