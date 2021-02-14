import { DecoratorVirtualNode } from "./DecoratorVirtualNode";


export class ParagraphVirtualNode extends DecoratorVirtualNode {
  createNode(): Node {
    return document.createElement("p");
  }
}
