import { BaseHtmlNode } from "./BaseHtmlNode";

export interface IIterator<T> {
  hasNext(): boolean;
  next(): T;
}

export class HtmlNodeIterator implements IIterator<BaseHtmlNode> {
  private current: BaseHtmlNode;
  constructor(private node: BaseHtmlNode) {
    this.current = node;
  }

  hasNext(): boolean {
    return this.current.getNext() !== undefined;
  }
  next(): BaseHtmlNode {
    const next = this.current.getNext();

    if (next) {
      return (this.current = next);
    }
    throw new Error("Next not found!");
  }
}
