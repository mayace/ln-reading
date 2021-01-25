import { ICommand } from "../../../models/Command";
import { IHighLightTextParams } from "./IHighLightTextParams";
import { DocumentDOM } from "./DocumentDOM";


export class HighLightTextCommand implements ICommand {
  constructor(private document: DocumentDOM, private params: IHighLightTextParams) { }
  execute(): void {
    this.document.highLightText();
  }
}
