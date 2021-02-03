import { ViewSettings } from "../../models/Settings";
import { NavigationSettings } from "../../models/NavigationSettings";
import { DocumentSettings } from "../../models/DocumentSettings";

export class ReadingSettings {
  id = "";
  document = new DocumentSettings();
  view = new ViewSettings();
  navigation = new NavigationSettings();
}
