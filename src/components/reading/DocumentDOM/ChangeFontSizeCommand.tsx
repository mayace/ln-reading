import { ICommand } from "../../../models/Command";
import { IChangeFontSizeParams } from "./IChangeFontSizeParams";
import { DocumentDOM } from "./DocumentDOM";


export class ChangeFontSizeCommand implements ICommand {
  constructor(private document: DocumentDOM, private params: IChangeFontSizeParams) { }
  execute(): void {
    this.document.changeFontSize(this.params.fontSize);
  }
}
