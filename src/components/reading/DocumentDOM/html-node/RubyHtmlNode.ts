import { BaseHtmlNode } from "./BaseHtmlNode";
import { DecoratorHtmlNode } from "./DecoratorHtmlNode";


export class RubyHtmlNode extends DecoratorHtmlNode {
  constructor(node: BaseHtmlNode, private rtText: string) {
    super(node);
  }

  createHtml(): Node {
    return document.createElement("ruby");
  }

  getHtml(): Node {
    const html = super.getHtml();
    const rt = document.createElement("rt");
    rt.appendChild(document.createTextNode(this.rtText));
    html.appendChild(rt);
    return html;
  }
}
