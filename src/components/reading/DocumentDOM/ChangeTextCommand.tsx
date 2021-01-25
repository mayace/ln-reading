import { ICommand } from "../../../models/Command";
import { IChangeTextParams } from "./IChangeTextParams";
import { DocumentDOM } from "./DocumentDOM";


export class ChangeTextCommand implements ICommand {
  constructor(private document: DocumentDOM, private params: IChangeTextParams) { }
  execute(): void {
    this.document.changeText(this.params.elementList);
  }
}
