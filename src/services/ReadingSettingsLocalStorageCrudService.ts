import { ReadingSettings } from "../components/reading/ReadingSettings";
import { LocalStorageCrudService } from "./LocalStorageCrudService";


export class ReadingSettingsLocalStorageCrudService extends LocalStorageCrudService<ReadingSettings> {
    itemComparator(id: string, item: ReadingSettings): boolean {
        return id === item.id;
    }

}
