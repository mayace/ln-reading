import { DecoratorVirtualNode } from "./DecoratorVirtualNode";


export class SpanVirtualNode extends DecoratorVirtualNode {
  createNode(): Node {
    return document.createElement("span");
  }
}
