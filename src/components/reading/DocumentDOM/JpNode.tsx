import { JpNodeType } from "./JpNodeType";


export class JpNode {
  type = JpNodeType.text;
  private _start = 0;
  private _text;
  private children: JpNode[] = [];

  constructor(type: JpNodeType, text: string, start: number) {
    this.type = type;
    this._text = text;
    this._start = start;
  }

  get start(): number {
    return this._start;
  }

  get text(): string {
    if (this.children.length > 0) {
      return this.children
        .map((item) => (item.type === JpNodeType.rt ? "" : item.text))
        .reduce((prev, current) => prev + current);
    }
    return this._text;
  }

  get length(): number {
    return this.text.length;
  }

  get hasChildren(): boolean {
    return this.children.length > 0;
  }
  toHtml(): Node {
    return this.getHtmlNode();
  }

  getHtmlNode(): Node {
    let el: Node;
    switch (this.type) {
      case JpNodeType.rt:
        el = document.createElement("rt");
        break;
      case JpNodeType.ruby:
        el = document.createElement("ruby");
        break;
      case JpNodeType.span:
        el = document.createElement("span");
        break;
      default:
        el = document.createTextNode(this.text);
    }
    if (this.hasChildren) {
      this.children.forEach((item) => el.appendChild(item.getHtmlNode()));
    } else if (this.type !== JpNodeType.text) {
      el.appendChild(document.createTextNode(this.text));
    }

    return el;
  }

  getChildren(start: number, end = this.start + this.length): JpNode[] {
    if (this.children.length > 0) {
      return this.children.filter((item) => {
        const itemEnd = item.start + item.length;
        const itemStart = item.start;
        const zeroValidation = end - start > 0;
        if (zeroValidation) {
          const leftValidation = start < itemStart && itemStart < end && end <= itemEnd;
          const rightValidation = itemStart <= start && start < itemEnd && itemEnd < end;
          const innerValidation = start >= itemStart && end <= itemEnd;
          const outerValidation = start < itemStart && end > itemEnd;
          return leftValidation || rightValidation || innerValidation || outerValidation;
        }
        return false;
      });
    }
    return [];
  }
  createChild(start: number, end: number, type: JpNodeType): void {
    if (this.hasChildren) {
      const filtered = this.getChildren(start, end).filter((item) => {
        const isNotRt = item.type !== JpNodeType.rt;
        return isNotRt;
      });

      filtered.forEach((item) => {
        item.createChild(start, end, type);
      });

      if (filtered.length === 0) {
        console.log(
          `no children found in range ${start},${end}, from item with start ${this.start}, and length ${this.length}`
        );
        console.log(this.children);
      }
      return;
    }

    if (start > this.start) {
      const leftText = this._text.substring(0, start - this.start);
      this.children.push(new JpNode(JpNodeType.text, leftText, 0));
    }
    const midText = this._text.substring(start - this.start, end - this.start);
    this.children.push(new JpNode(type, midText, start));
    // console.log([start, end, this._text, midText]);
    if (end < this.start + this._text.length) {
      const rightText = this._text.substring(end - this.start);
      // console.log([start,end,this._text,rightText]);
      this.children.push(new JpNode(JpNodeType.text, rightText, end));
    }
    this._text = "";
    this.type = JpNodeType.span;
  }

  private updateStart(start: number) {
    this._start = start;

    if (this.hasChildren) {
      let s = start;
      this.children.forEach((item) => {
        item.updateStart(s);
        s += item.length;
      });
    }
  }

  appendChild(node: JpNode): void {
    node.updateStart(this.length);
    this.children.push(node);
  }

  static fromHtml(el: Node): JpNode {
    const currentStart = 0;
    if (el instanceof Text) {
      return new JpNode(JpNodeType.text, el.textContent || "", currentStart);
    }

    let type = JpNodeType.span;
    switch (el.nodeName.toLocaleLowerCase()) {
      case "ruby":
        type = JpNodeType.ruby;
        break;
      case "rt":
        type = JpNodeType.rt;
        break;
    }

    if (el.hasChildNodes()) {
      const jpNode = new JpNode(type, "", currentStart);
      el.childNodes.forEach((item) => {
        const childJpNode = JpNode.fromHtml(item);
        jpNode.appendChild(childJpNode);
      });
      return jpNode;
    } else {
      const text = el.textContent?.trim() || "";
      return new JpNode(type, text, currentStart);
    }
  }
}
