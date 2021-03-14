import { DecoratorHtmlNode } from "./DecoratorHtmlNode";


export class ParagraphHtmlNode extends DecoratorHtmlNode {
  createHtml(): Node {
    return document.createElement("p");
  }
}
