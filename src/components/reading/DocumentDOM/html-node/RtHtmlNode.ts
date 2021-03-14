import { DecoratorHtmlNode } from "./DecoratorHtmlNode";


export class RtHtmlNode extends DecoratorHtmlNode {
  createHtml(): Node {
    return document.createElement("rt");
  }
}
