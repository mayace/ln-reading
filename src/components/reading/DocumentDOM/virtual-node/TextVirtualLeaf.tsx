import { IVirtualNode } from "./IVirtualNode";


export class TextVirtualLeaf implements IVirtualNode {
  constructor(public text: string) { }
  toHtml(): Node {
    const el = document.createTextNode(this.text);
    return el;
  }
}
