import { DecoratorHtmlNode } from "./DecoratorHtmlNode";

export class SpanHtmlNode extends DecoratorHtmlNode {
  createHtml(): Node {
    return document.createElement("span");
  }
}


