import React, { createElement } from "react";
import { ICommand } from "../models/Command";

export class DocumentDOMState {
  fontSize = 14;
  textColor = "#FFCC33";
  background = "#280000";
  sizeUnit = "px";
}
export interface IDocumentDOMProps {
  text: string;
}

export interface IChangeFontSizeParams {
  fontSize: number;
}
export class ChangeFontSizeCommand implements ICommand {
  constructor(private document: DocumentDOM, private params: IChangeFontSizeParams) {}
  execute(): void {
    this.document.changeFontSize(this.params.fontSize);
  }
}

export interface IChangeTextParams {
  elementList: Element[];
}

export class ChangeTextCommand implements ICommand {
  constructor(private document: DocumentDOM, private params: IChangeTextParams) {}
  execute(): void {
    this.document.changeText(this.params.elementList);
  }
}

export interface IHighLightTextParams {
  keywordList: { text: string; color: string }[];
}
export class HighLightTextCommand implements ICommand {
  constructor(private document: DocumentDOM, private params: IHighLightTextParams) {}
  execute(): void {
    this.document.highLightText(this.params.keywordList);
  }
}
export interface ITextRangePosition {
  i1: number;
  i2: number;
}
export interface IKeyword {
  text: string;
  color: string;
}

export class DocumentDOM extends React.Component<IDocumentDOMProps, DocumentDOMState> {
  state = new DocumentDOMState();

  get documentHtmlElement(): HTMLElement {
    return document.querySelector(".document-dom") as HTMLElement;
  }
  changeText(to: Element[]): void {
    const el = document.querySelector(".document-dom") as HTMLElement;
    el.innerHTML = "";
    to.forEach((item) => el.appendChild(item));
  }
  changeFontSize(to: number): void {
    this.setState({ fontSize: to });
  }

  highLightText(textList: IKeyword[]): void {
    this.documentHtmlElement.childNodes.forEach((item) => {
      const list: (ITextRangePosition & IKeyword)[] = [];
      const text = item.textContent?.trim() || "";
      if (text.length > 0) {
        textList.forEach((jtem) => {
          if (jtem.text.trim().length > 0) {
            const regexp = new RegExp(jtem.text, "gm");
            let match: RegExpExecArray | null;
            while ((match = regexp.exec(text)) !== null) {
              const i1 = match.index;
              const i2 = match.index + jtem.text.length;
              list.push({ i1, i2, color: jtem.color, text: jtem.text });
            }
          }

          const cleanList = this.getNonConflictTextRangePositionArray(list) as (ITextRangePosition &
            IKeyword)[];

          //remove children
          let child: ChildNode | null;
          while ((child = item.firstChild)) {
            item.removeChild(child);
          }

          if (cleanList.length === 0) {
            item.appendChild(document.createTextNode(text));
          } else {
            let jndex = 0;
            const sortedList = cleanList.sort((a,b)=> a.i1 - b.i1);
            sortedList.forEach((jtem) => {
              if (jtem.i1 > jndex) {
                item.appendChild(document.createTextNode(text.substring(jndex, jtem.i1)));
              }

              const span = document.createElement("span");
              span.style.background = jtem.color;
              span.setAttribute("dd", `${jtem.i1},${jtem.i2}`);
              span.appendChild(document.createTextNode(text.substring(jtem.i1, jtem.i2)));
              item.appendChild(span);

              jndex = jtem.i2;
            });

            if (jndex < text.length) {
              item.appendChild(document.createTextNode(text.substring(jndex, text.length)));
            }
          }

          // console.log([list, cleanList]);
          // let finalText = text.trim();
          // cleanList.forEach((jtem) => {
          //   finalText = finalText.replaceAll(
          //     jtem.text,
          //     `<span style="background:${jtem.color};">${jtem.text}</span>`
          //   );
          // });

          // (item as HTMLElement).innerHTML = finalText;
        });
      }
    });
  }

  


  getNonConflictTextRangePositionArray(
    list: ITextRangePosition[],
    startAt = 1
  ): ITextRangePosition[] {
    if (list.length > 1) {
      const jtem = list[Math.max(1, startAt)];

      const gList = list
        .map((ktem, kindex) => {
          if (kindex < startAt) {
            const lComparison = ktem.i1 >= jtem.i1 && ktem.i1 <= jtem.i2;
            const rComparison = ktem.i2 <= jtem.i2 && ktem.i2 >= jtem.i1;
            if (lComparison && rComparison) {
              return null;
            } else if (lComparison) {
              return { ...ktem, i1: jtem.i2, i2: ktem.i2 };
            } else if (rComparison) {
              return { ...ktem, i1: ktem.i1, i2: jtem.i1 };
            }
          }

          return ktem;
        })
        .filter((ktem) => ktem !== null) as ITextRangePosition[];

      return startAt < gList.length - 1
        ? this.getNonConflictTextRangePositionArray(gList, startAt + 1)
        : gList;
    }

    return list;
  }

  get currentStyle(): React.CSSProperties {
    return {
      fontSize: this.state.fontSize + this.state.sizeUnit,
      color: this.state.textColor,
      background: this.state.background,
    };
  }
  render(): JSX.Element {
    return <div style={this.currentStyle} className="document-dom"></div>;
  }
}
