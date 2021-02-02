
export interface ICommand {
  execute(): void;
}

export interface IChangeFontSizeCommandProps {
  document: HTMLElement;
  fontSize: number;
}

export interface ICommandProccesor {
  place(command: ICommand): void;
  proccess(): void;
}

export class CommandProccesor implements ICommandProccesor {
  private commandList: ICommand[] = [];

  place(command: ICommand): void {
    this.commandList.push(command);
  }

  proccess(): void {
    this.commandList.forEach((item) => {
      try {
        item.execute()
      } catch (error) {
        console.log([error]);
      }
    });
    this.commandList.length = 0;
  }
}


