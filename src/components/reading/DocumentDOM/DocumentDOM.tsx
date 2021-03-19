import React, { ReactNode } from "react";
import { DocumentDOMState } from "./DocumentDOMState";
import { ParagraphHtmlNode } from "./html-node/ParagraphHtmlNode";
import { RubyHtmlNode } from "./html-node/RubyHtmlNode";
import { TextHtmlNode } from "./html-node/TextHtmlNode";
import { IDocumentDOMProps } from "./IDocumentDOMProps";
import { IKeyword } from "./IKeyword";
import { ITextRangePosition } from "./ITextRangePosition";
import { JpNode } from "./JpNode";
import { JpNodeType } from "./JpNodeType";

export class DocumentDOM extends React.Component<IDocumentDOMProps, DocumentDOMState> {
  state = new DocumentDOMState();
  contentElement: HTMLElement | null = null;

  get contentStyle(): React.CSSProperties {
    return {
      padding: "25px",
    };
  }

  get documentHtmlElement(): HTMLElement {
    return document.querySelector(".document-dom") as HTMLElement;
  }
  changeText(elementList: Element[]): void {
    const el = this.contentElement;
    if (el) {
      this.cleanElement(el);
      elementList.forEach((item) => {
        const text = new TextHtmlNode(this.getTextFromHtml(item));
        let pointer = text;
        item.childNodes.forEach((jtem) => {
          const jnode = new TextHtmlNode(this.getTextFromHtml(jtem));
          if (jtem.nodeName === "RUBY") {
            pointer = pointer.append(
              new RubyHtmlNode(jnode, this.getRtTextFromRuby(jtem as Element)),
            );
          } else {
            pointer = pointer.append(jnode);
          }
        });

        const node = new ParagraphHtmlNode(text);
        // const jpNode = JpNode.fromHtml(item);
        // this.highlightText(jpNode, this.props.KeywordList);
        el.appendChild(node.getHtml());
      });
    }
  }
  changeFontSize(to: number): void {
    this.setState({ fontSize: to });
  }

  private getRtTextFromRuby(node: Element): string {
    return node.querySelector("rt")?.textContent || "";
  }
  private getTextFromHtml(node: Node): string {
    if (node.nodeName === "RT") {
      return "";
    }

    if (node.hasChildNodes()) {
      let text = "";
      node.childNodes.forEach((jtem) => {
        text += this.getTextFromHtml(jtem);
      });
      return text;
    }

    return node.textContent || "";
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
            node.createChild(start, end, JpNodeType.span, { style: `background:${item.color};` });
          }
        }
      });
    }
  }

  highLightText(): void {
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
    startAt = 1,
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
    const { fontSize, color, background, unitSize } = this.props;
    return {
      fontSize: fontSize + unitSize,
      color,
      background,
      borderRadius: "10px",
    };
  }

  onTryToSelectText(): void {
    const selection = window.getSelection()?.toString().trim() || "";
    if (selection.length > 0) {
      const { onTextSelected } = this.props;
      onTextSelected(selection);
    }
  }

  renderItem(node: Node): JSX.Element {
    if (node instanceof Text) {
      return <span>{node.textContent}</span>;
    }
    if (node.nodeName === "RT") {
      return <rt>{node.textContent}</rt>;
    }

    const children: JSX.Element[] = [];
    node.childNodes.forEach((jtem) => children.push(this.renderItem(jtem)));

    if (node.nodeName === "RUBY") {
      return <ruby>{children}</ruby>;
    }
    return <span>{children}</span>;
  }

  renderList(list: Node[]): JSX.Element {
    return (
      <div className="list">
        {list.map((item, index) => {
          return <p key={index}>{this.renderItem(item)}</p>;
        })}
      </div>
    );
  }

  render(): ReactNode {
    return (
      <div style={this.currentStyle} className="document-dom">
        <div
          ref={(el) => (this.contentElement = el)}
          style={this.contentStyle}
          onMouseUpCapture={() => this.onTryToSelectText()}
          className="content"
        ></div>
      </div>
    );
  }
}
