import { DecoratorVirtualNode } from "./DecoratorVirtualNode";


export class RubyVirtualNode extends DecoratorVirtualNode {
  createNode(): Node {
    return document.createElement("ruby");
  }
}
