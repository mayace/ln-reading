import { ICommand } from "../../models/Command";

export class FuriganaVisibilityCommand implements ICommand {
  static CLASSNAME = "furigana-off";

  constructor(private visible: boolean) {}

  execute(): void {
    document.body.classList.add(FuriganaVisibilityCommand.CLASSNAME);
    if (this.visible) {
      document.body.classList.remove(FuriganaVisibilityCommand.CLASSNAME);
    }
  }
}
