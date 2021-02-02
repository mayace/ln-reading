import { ICommand } from "../../models/Command";
import { ReadingComponent } from "./ReadingComponent";
import { IDimension } from "./IDimension";

export class UpdateTopHeightCommand implements ICommand {
  constructor(private home: ReadingComponent, private params: IDimension) { }
  execute(): void {
    this.home.updateTopHeight(this.params.height);
  }
}
