import { IKeyword } from "./IKeyword";

export interface IDocumentDOMProps {
  KeywordList: IKeyword[];
  fontSize: number;
  unitSize: string;
  color: string;
  background: string;
  onTextSelected: (text: string) => void;
}
