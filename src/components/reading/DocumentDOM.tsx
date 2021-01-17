import { inRange } from "lodash";
import { homedir } from "os";
import React, { ReactNode } from "react";
import { ICommand } from "../../models/Command";

export class DocumentDOMState {
  fontSize = 14;
  textColor = "#FFCC33";
  background = "#280000";
  sizeUnit = "px";
}
export interface IDocumentDOMProps {
  KeywordList: IKeyword[];
  onTextSelected: (text: string) => void;
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
  contentElement: HTMLElement | null = null;

  get documentHtmlElement(): HTMLElement {
    return document.querySelector(".document-dom") as HTMLElement;
  }
  changeText(elementList: Element[]): void {
    const el = this.contentElement;
    if (el) {
      this.cleanElement(el);
      elementList.forEach((item) => {
        const jpNode = JpNode.fromHtml(item);
        this.highlightText(jpNode, this.props.KeywordList);
        el.appendChild(jpNode.getHtmlNode());
      });
    }
  }
  changeFontSize(to: number): void {
    this.setState({ fontSize: to });
  }

  cleanElement(el: Element): void {
    let child: ChildNode | null;
    while ((child = el.firstChild)) {
      el.removeChild(child);
    }
  }

  highlightText(node: JpNode, textList: IKeyword[]): void {
    if (node.length > 0) {
      const text = node.text;

      textList.forEach((item) => {
        const itemText = item.text.trim() || "";
        if (itemText.length > 0) {
          const regexp = new RegExp(itemText, "gm");
          let match: RegExpExecArray | null;
          while ((match = regexp.exec(text)) !== null) {
            const start = match.index;
            const end = match.index + itemText.length;
            // console.log([start, end, itemText]);
            node.createChild(start, end, JpNodeType.span);
          }
        }
      });
    }
  }

  highLightText(textList: IKeyword[]): void {
    // this.documentHtmlElement.childNodes.forEach((item) => {
    //   const list: (ITextRangePosition & IKeyword)[] = [];
    //   const text = item.textContent?.trim() || "";
    //   if (text.length > 0) {
    //     textList.forEach((jtem) => {
    //       if (jtem.text.trim().length > 0) {
    //         const regexp = new RegExp(jtem.text, "gm");
    //         let match: RegExpExecArray | null;
    //         while ((match = regexp.exec(text)) !== null) {
    //           const i1 = match.index;
    //           const i2 = match.index + jtem.text.length;
    //           list.push({ i1, i2, color: jtem.color, text: jtem.text });
    //         }
    //       }
    //       const cleanList = this.getNonConflictTextRangePositionArray(list) as (ITextRangePosition &
    //         IKeyword)[];
    //       //remove children
    //       let child: ChildNode | null;
    //       while ((child = item.firstChild)) {
    //         item.removeChild(child);
    //       }
    //       if (cleanList.length === 0) {
    //         item.appendChild(document.createTextNode(text));
    //       } else {
    //         let jndex = 0;
    //         const sortedList = cleanList.sort((a, b) => a.i1 - b.i1);
    //         sortedList.forEach((jtem) => {
    //           if (jtem.i1 > jndex) {
    //             item.appendChild(document.createTextNode(text.substring(jndex, jtem.i1)));
    //           }
    //           const span = document.createElement("span");
    //           span.style.background = jtem.color;
    //           span.setAttribute("dd", `${jtem.i1},${jtem.i2}`);
    //           span.appendChild(document.createTextNode(text.substring(jtem.i1, jtem.i2)));
    //           item.appendChild(span);
    //           jndex = jtem.i2;
    //         });
    //         if (jndex < text.length) {
    //           item.appendChild(document.createTextNode(text.substring(jndex, text.length)));
    //         }
    //       }
    //       // console.log([list, cleanList]);
    //       // let finalText = text.trim();
    //       // cleanList.forEach((jtem) => {
    //       //   finalText = finalText.replaceAll(
    //       //     jtem.text,
    //       //     `<span style="background:${jtem.color};">${jtem.text}</span>`
    //       //   );
    //       // });
    //       // (item as HTMLElement).innerHTML = finalText;
    //     });
    //   }
    // });
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

  onTryToSelectText(): void {
    const selection = window.getSelection()?.toString().trim() || "";
    if (selection.length > 0) {
      const { onTextSelected } = this.props;
      onTextSelected(selection);
    }
  }

  render(): ReactNode {
    return (
      <div
        ref={(el) => (this.contentElement = el)}
        style={this.currentStyle}
        onMouseUpCapture={() => this.onTryToSelectText()}
        className="document-dom"
      ></div>
    );
  }
}

export enum JpNodeType {
  text = 0,
  ruby = 1,
  rt = 2,
  span = 3,
}

export class JpNode {
  type = JpNodeType.text;
  private _start = 0;
  private _text;
  private children: JpNode[] = [];

  constructor(type: JpNodeType, text: string, start: number) {
    this.type = type;
    this._text = text;
    this._start = start;
  }

  get start(): number {
    return this._start;
  }

  get text(): string {
    if (this.children.length > 0) {
      return this.children
        .map((item) => (item.type === JpNodeType.rt ? "" : item.text))
        .reduce((prev, current) => prev + current);
    }
    return this._text;
  }

  get length(): number {
    return this.text.length;
  }

  get hasChildren(): boolean {
    return this.children.length > 0;
  }
  toHtml(): Node {
    return this.getHtmlNode();
  }

  getHtmlNode(): Node {
    let el: Node;
    switch (this.type) {
      case JpNodeType.rt:
        el = document.createElement("rt");
        break;
      case JpNodeType.ruby:
        el = document.createElement("ruby");
        break;
      case JpNodeType.span:
        el = document.createElement("span");
        break;
      default:
        el = document.createTextNode(this.text);
    }
    if (this.hasChildren) {
      this.children.forEach((item) => el.appendChild(item.getHtmlNode()));
    } else if (this.type !== JpNodeType.text) {
      el.appendChild(document.createTextNode(this.text));
    }

    return el;
  }

  getChildren(start: number, end = this.start + this.length): JpNode[] {
    if (this.children.length > 0) {
      return this.children.filter((item) => {
        const itemEnd = item.start + item.length;
        const itemStart = item.start;
        const zeroValidation = end - start > 0;
        if (zeroValidation) {
          const leftValidation = start < itemStart && itemStart < end && end <= itemEnd;
          const rightValidation = itemStart <= start && start < itemEnd && itemEnd < end;
          const innerValidation = start >= itemStart && end <= itemEnd;
          const outerValidation = start < itemStart && end > itemEnd;
          return leftValidation || rightValidation || innerValidation || outerValidation;
        }
        return false;
      });
    }
    return [];
  }
  createChild(start: number, end: number, type: JpNodeType): void {
    if (this.hasChildren) {
      const filtered = this.getChildren(start, end).filter((item) => {
        const isNotRt = item.type !== JpNodeType.rt;
        return isNotRt;
      });

      filtered.forEach((item) => {
        item.createChild(start, end, type);
      });

      if (filtered.length === 0) {
        console.log(
          `no children found in range ${start},${end}, from item with start ${this.start}, and length ${this.length}`
        );
        console.log(this.children);
      }
      return;
    }

    if (start > this.start) {
      const leftText = this._text.substring(0, start - this.start);
      this.children.push(new JpNode(JpNodeType.text, leftText, 0));
    }
    const midText = this._text.substring(start - this.start, end - this.start);
    this.children.push(new JpNode(type, midText, start));
    // console.log([start, end, this._text, midText]);
    if (end < this.start + this._text.length) {
      const rightText = this._text.substring(end - this.start);
      // console.log([start,end,this._text,rightText]);
      this.children.push(new JpNode(JpNodeType.text, rightText, end));
    }
    this._text = "";
    this.type = JpNodeType.span;
  }

  private updateStart(start: number) {
    this._start = start;

    if (this.hasChildren) {
      let s = start;
      this.children.forEach((item) => {
        item.updateStart(s);
        s += item.length;
      });
    }
  }

  appendChild(node: JpNode): void {
    node.updateStart(this.length);
    this.children.push(node);
  }

  static fromHtml(el: Node): JpNode {
    const currentStart = 0;
    if (el instanceof Text) {
      return new JpNode(JpNodeType.text, el.textContent || "", currentStart);
    }

    let type = JpNodeType.span;
    switch (el.nodeName.toLocaleLowerCase()) {
      case "ruby":
        type = JpNodeType.ruby;
        break;
      case "rt":
        type = JpNodeType.rt;
        break;
    }

    if (el.hasChildNodes()) {
      const jpNode = new JpNode(type, "", currentStart);
      el.childNodes.forEach((item) => {
        const childJpNode = JpNode.fromHtml(item);
        jpNode.appendChild(childJpNode);
      });
      return jpNode;
    } else {
      const text = el.textContent?.trim() || "";
      return new JpNode(type, text, currentStart);
    }
  }
}
