import { ICrudLikeService } from "../../services/IService";
import { FeedItem } from "./Feed";

export interface IExplorerComponentProps {
  feedItemService: ICrudLikeService<FeedItem>;
}
