
export class NavigationSettings {
  length = 10;
  pageI = 0;
  separator = "";
}
export class ViewSettings {
  left = { width: 0 }
  top = { height: 0 }
  right = { width: 0 }
}
export class DocumentSettings {
  fontSize = 14
}

export class Settings {
  document = new DocumentSettings()

  content = {
    localStorageKey: "",
  };

  view = new ViewSettings()

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
  id = new Date().getTime()
  text = "";
  color = "";
  isGlobal = false;
}
