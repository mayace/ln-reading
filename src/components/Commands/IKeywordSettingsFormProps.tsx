import { KeywordSettings } from "../../models/Settings";


export interface IKeywordSettingsFormProps {
  item: KeywordSettings;
  onSave: (item: KeywordSettings) => void;
  onCancel: () => void;
}
