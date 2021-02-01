import { KeywordSettings } from "../../models/Settings";

export interface IKeywordListProps {
  keywordList: KeywordSettings[];
  onChange: (item: KeywordSettings) => void;
  onCreate: (item: KeywordSettings) => void;
  onSelect: (item: KeywordSettings) => void;
  onDelete: (index: number) => void;
  defaultText: string;
  // onCreate: (item: KeywordSettings) => void;
}
