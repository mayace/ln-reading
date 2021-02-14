import { IVirtualNode } from "./IVirtualNode";


export class ImageVirtualLeaf implements IVirtualNode {
  constructor(private src: string) { }
  text = "";
  toHtml(): Node {
    const el = document.createElement("img");
    //     const style = new CSSStyleDeclaration()
    //     style.cssText
    // el.setAttribute("","")
    el.src = this.src;
    return el;
  }
}
