import { ICommand } from "../../models/Command";
import { ReadingComponent } from "./ReadingComponent";
import { IDimension } from "./IDimension";

export class UpdateRightWidthCommand implements ICommand {
  constructor(private home: ReadingComponent, private params: IDimension) { }
  execute(): void {
    this.home.updateRightWidth(this.params.width);
  }
}
