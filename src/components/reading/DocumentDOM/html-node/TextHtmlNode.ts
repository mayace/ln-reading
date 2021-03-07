import { BaseHtmlNode } from "./BaseHtmlNode";

export class TextHtmlNode extends BaseHtmlNode {
  getHtml(): Node {
    return document.createTextNode(this.getText());
  }
}
