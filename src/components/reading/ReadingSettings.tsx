import {
  DocumentSettings,

  NavigationSettings,
  ViewSettings
} from "../../models/Settings";


export class ReadingSettings {
  document = new DocumentSettings();
  view = new ViewSettings();
  navigation = new NavigationSettings();
}
