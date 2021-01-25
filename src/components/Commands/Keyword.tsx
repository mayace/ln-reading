import { KeywordSettings } from "../../models/Settings";

export interface IKeywordItemProps {
  keyword: KeywordSettings;
  onChange: (to: KeywordSettings) => void;
  onClick: (item: KeywordSettings) => void;
}
