import { ConcreteSubscription } from "./Subscription";

export class NavigationSettings {
  length = 10;
  pageI = 0;
  separator = "";
}

export class Settings {
  fontSize: number = 14;
  textSelected = "";

  content = {
    localStorageKey: "",
  };

  layout = {
    left: { width: 100 },
    top: { height: 100 },
  };
  
  navigation = new NavigationSettings()
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
  text = "";
  color = "";
  isGlobal = false;
}
