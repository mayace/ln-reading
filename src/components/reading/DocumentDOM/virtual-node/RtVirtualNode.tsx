import { DecoratorVirtualNode } from "./DecoratorVirtualNode";


export class RtVirtualNode extends DecoratorVirtualNode {
  createNode(): Node {
    return document.createElement("rt");
  }
}
