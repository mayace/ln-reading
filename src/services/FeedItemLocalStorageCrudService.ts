import { FeedItem } from "../components/explorer/Feed";
import { LocalStorageCrudService } from "./LocalStorageCrudService";



export class FeedItemLocalStorageCrudService extends LocalStorageCrudService<FeedItem> {
    itemComparator(id: string, item: FeedItem): boolean {
        return id === item.guid;
    }
}
