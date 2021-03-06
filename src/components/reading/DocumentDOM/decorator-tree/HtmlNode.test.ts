describe("HtmlNode tests", () => {
  it("text node", () => {
    const text1 = new TextHtmlNode("hola mundo!");

    expect(text1.getMap()).toEqual([0, 11]);
    expect(text1.getText()).toEqual("hola mundo!");
    expect(text1.getHtml() instanceof Text).toEqual(true);
  });

  it("span node", () => {
    const text1 = new TextHtmlNode("hola mundo!");
    const span1 = new SpanHtmlNode(text1, "o", new CSSStyleDeclaration());

    expect(span1.getMap()).toEqual([0, 1, 2, 9, 10, 11]);
    expect(span1.map).toEqual([1, 2, 9, 10]);
    expect(span1.getText()).toEqual("hola mundo!");
    expect(span1.text).toEqual("o");
    expect(span1.getHtml() instanceof HTMLSpanElement).toEqual(true);
  });
});

export interface IIterator<T> {
  hasNext(): boolean;
  next(): T | undefined;
}

export interface IComposite<T> {
  append(node: T): T;
}

export interface INode {
  getText(): string;
  getMap(): number[];
}
export abstract class IHtmlNode2 implements INode, IIterator<IHtmlNode2>, IComposite<IHtmlNode2> {
  private __next: IHtmlNode2 | undefined;
  private __style = new CSSStyleDeclaration();
  constructor(private text: string) {}

  abstract getHtml(): Node;

  getStyle(): CSSStyleDeclaration {
    return this.__style;
  }

  getText(): string {
    return this.text;
  }
  getMap(): number[] {
    return [0, this.text.length];
  }
  hasNext(): boolean {
    return this.__next !== undefined;
  }
  next(): IHtmlNode2 | undefined {
    return this.__next;
  }
  append(node: IHtmlNode2): IHtmlNode2 {
    return (this.__next = node);
  }
}

export interface IHtmlNode extends INode {
  getHtml(): Node;
  getStyle(): CSSStyleDeclaration;
}

export abstract class DecoratorHtmlNode implements IHtmlNode {
  private _text: string;
  private next: IHtmlNode | undefined;
  get text(): string {
    return this._text;
  }
  get map(): number[] {
    return this.generateMap(this.getText(), this.text);
  }
  abstract get html(): HTMLElement;

  constructor(text: string, private style: CSSStyleDeclaration) {
    this._text = text;
  }
  append(node: IHtmlNode): void {
    throw new Error("Method not implemented.");
  }

  getText(): string {
    return this.next.getText();
  }
  getMap(): number[] {
    const prev = this.next.getMap();
    const current = this.map;

    return this.generateNext(prev, current);
  }
  getStyle(): CSSStyleDeclaration {
    return this.style;
  }
  getHtml(): Node {
    // [...this.getHtml(), this.html].forEach((item) => this.html.appendChild(item));
    return this.html;
  }

  /**
   * calculate the merge of index array
   * @param prev cames in order, this one always has the full range 0 to total
   * @param current this one take priority on the merge
   */
  private generateNext(prev: number[], current: number[]): number[] {
    //   [0,5]
    //   [0,3]
    //   ------
    //   [0,3,5]

    // const length = current.length;
    // const next = [...prev.filter((item) => item < current[0])];
    // next.push(...current);
    // next.push(...prev.filter((item) => item > current[length - 1]));

    let index = 0;
    let value = current[index];
    const toValue = prev[prev.length - 1];
    const next = [...prev.filter((item) => item < value)];

    // console.log([prev,current]);
    while (value <= toValue) {
      // the current is added in pairs, the first and the second
      // the first
      next.push(value);
      // the secound
      const secondValue = current[index + 1];
      next.push(secondValue);
      // the third
      index += 1 + 1;
      value = current[index];
      if (value) {
        next.push(...prev.filter((item) => item > secondValue && item < value));
      } else {
        next.push(...prev.filter((item) => item > secondValue));
      }
    }

    return next;
  }

  private generateMap(source: string, target: string): number[] {
    const regExp = new RegExp(target, "mg");
    let match: RegExpExecArray | null;
    const l: number[] = [];
    while ((match = regExp.exec(source))) {
      l.push(match.index);
      l.push(match.index + target.length);
    }

    return l;
  }

  getStyleAt(initial: number, final: number): CSSStyleDeclaration {
    return this.hasRange(this.map, initial, final)
      ? this.style
      : this.next instanceof DecoratorHtmlNode
      ? this.next.getStyleAt(initial, final)
      : this.next.getStyle();
  }

  getHtmlAt(initial: number, final: number): Node {
    return this.hasRange(this.map, initial, final)
      ? this.html
      : this.next instanceof DecoratorHtmlNode
      ? this.next.getHtmlAt(initial, final)
      : this.next.getHtml();
  }

  getNodeAt(initial: number, final: number): IHtmlNode {
    const hasRange = this.hasRange(this.map, initial, final);

    if (hasRange) {
      return this;
    }
    if (this.next instanceof DecoratorHtmlNode) {
      return this.next.getNodeAt(initial, final);
    }
    return this.next;
  }

  private hasRange(map: number[], initial: number, final: number): boolean {
    for (let index = 0; index < map.length; index += 2) {
      const item = map[index];
      const ftem = map[index + 1];

      if (initial >= item && final <= ftem) {
        return true;
      }
    }
    return false;
  }
}

export class TextHtmlNode implements IHtmlNode {
  private __next: IHtmlNode | undefined;

  constructor(private text: string) {}

  append(node: IHtmlNode): void {
    this.__next = node;
  }

  hasNext(): boolean {
    return this.__next !== undefined;
  }
  next(): IHtmlNode | undefined {
    return this.__next;
  }
  getText(): string {
    return this.text;
  }
  getMap(): number[] {
    return [0, this.text.length];
  }
  getHtml(): Node {
    return document.createTextNode(this.getText());
  }
  getStyle(): CSSStyleDeclaration {
    throw new Error("Method not implemented.");
  }
}

export class ParagraphHtmlNode extends IHtmlNode2{
  constructor(text: string){
    super(text);
    this.append()
  }
  getHtml(): Node {
    return 
  }
}

export class SpanHtmlNode extends DecoratorHtmlNode {
  get html(): HTMLElement {
    return document.createElement("span");
  }
}
