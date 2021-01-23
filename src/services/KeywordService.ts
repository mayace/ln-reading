import { KeywordSettings } from "../models/Settings";
import { LocalStorageService } from "./LocalStorageService";



export class KeywordLocalStorageService extends LocalStorageService<KeywordSettings[]>{
    createInstance(): KeywordSettings[] {
        return [];
    }

}