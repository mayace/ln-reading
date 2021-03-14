import { DecoratorHtmlNode } from "./DecoratorHtmlNode";


export class ImageHtmlNode extends DecoratorHtmlNode {
  createHtml(): Node {
    return document.createElement("img");
  }
}
