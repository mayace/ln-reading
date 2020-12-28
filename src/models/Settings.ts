import { ConcreteSubscription } from "./Subscription";

export class NavigationSettings {
  length = 10;
  pageI = 0;
  separator = "";
}

export class Settings {
  document = new DocumentSettings()

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

  public getCurrentPage(): PageSettings {
    return this.pages[this.navigation.pageI];
  }
}

export class DocumentSettings {
  fontSize = 14
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
