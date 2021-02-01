import { KeywordSettings } from "../models/Settings";
import { LocalStorageCrudService } from "./LocalStorageCrudService";



export class KeywordLocalStorageCrudService extends LocalStorageCrudService<KeywordSettings> {
    itemComparator(id: string, item: KeywordSettings): boolean {
        return id === item.id;
    }
}
