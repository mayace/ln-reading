import { BaseHtmlNode } from "./BaseHtmlNode";

export abstract class DecoratorHtmlNode extends BaseHtmlNode {
  abstract createHtml(): Node;
  constructor(private node: BaseHtmlNode) {
    super(node.getText());
  }

  getHtml(): Node {
    const html = this.createHtml();
    const children = this.node.getHtmlMap();

    children.forEach((item) => html.appendChild(item));

    return html;
  }
}
