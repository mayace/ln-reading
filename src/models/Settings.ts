import { DocumentSettings } from "./DocumentSettings";
import { NavigationSettings } from "./NavigationSettings";

export interface INavigationSettings {
  length: number;
  pageI: number;
  separator: string;
}
export class ViewSettings {
  left = { width: 0 };
  top = { height: 0 };
  right = { width: 0 };
}
export class Settings {
  document = new DocumentSettings();

  content = {
    localStorageKey: "",
  };

  view = new ViewSettings();

  navigation = new NavigationSettings();
  pages: { [key: number]: PageSettings } = {};
  commandList: CommandSettings[] = [{ code: "keywords", layout: "right" }];
}

export class CommandSettings {
  layout = "";
  code = "";
}

export class PageSettings {
  keyWordList: KeywordSettings[] = [];
}

export class KeywordSettings {
  id: string = new Date().getTime().toString();
  text = "";
  color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  isPinned = false;
}
