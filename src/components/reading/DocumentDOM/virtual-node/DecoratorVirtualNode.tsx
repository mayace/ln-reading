import { IVirtualNode } from "./IVirtualNode";

export abstract class DecoratorVirtualNode implements IVirtualNode {
  private children: IVirtualNode[] = [];

  get text(): string {
    return this.children.map((item) => item.text).reduce((prev, actual) => `${prev}${actual}`, "");
  }

  create(item: IVirtualNode): IVirtualNode {
    this.children.push(item);
    return this;
  }
  toHtml(): Node {
    const el = this.createNode();
    this.children.forEach((item) => el.appendChild(item.toHtml()));
    return el;
  }

  abstract createNode(): Node;
  // fromHtml(item: Node): void {
  //   const el = this.factory.fromHtml(item);
  //   if (item.hasChildNodes()) {
  //     item.childNodes.forEach((jtem) => el.append(this.factory.fromHtml(jtem)));
  //   }
  //   return el;
  // }
  remove(item: IVirtualNode): void {
    const index = this.children.findIndex((jtem) => jtem === item);
    this.children.splice(index, 1);
  }
}
