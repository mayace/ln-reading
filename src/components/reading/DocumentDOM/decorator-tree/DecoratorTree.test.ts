describe("group", () => {
  it("getMap() -> cesar", () => {
    const style = new CSSStyleDeclaration();
    const node = new TextDeNode("cesar");
    const dn1 = new SpanDeDeNode(node, "ces", style);
    const dn2 = new SpanDeDeNode(dn1, "sar", style);
    const dn3 = new SpanDeDeNode(dn2, "esa", style);

    // console.log(dn2.getMap())
    expect(node.getMap()).toEqual([0, 5]);
    expect(dn1.getMap()).toEqual([0, 3, 5]);
    expect(dn2.getMap()).toEqual([0, 2, 5]);
    expect(dn3.getMap()).toEqual([0, 1, 4, 5]);
  });
  it("getMap() -> intertwined", () => {
    const style = new CSSStyleDeclaration();
    const node = new TextDeNode("hola mundo");
    const dn1 = new SpanDeDeNode(node, "hol", style);
    const dn2 = new SpanDeDeNode(dn1, "mun", style);
    const dn3 = new SpanDeDeNode(dn2, "ola", style);
    const dn4 = new SpanDeDeNode(dn3, "a m", style);

    expect(node.getMap()).toEqual([0, 10]);
    expect(dn1.getMap()).toEqual([0, 3, 10]);
    expect(dn2.getMap()).toEqual([0, 3, 5, 8, 10]);
    expect(dn3.getMap()).toEqual([0, 1, 4, 5, 8, 10]);
    expect(dn4.getMap()).toEqual([0, 1, 3, 6, 8, 10]);
  });

  it("getMap() -> more than one match", () => {
    const style = new CSSStyleDeclaration();
    const node = new TextDeNode("hola mundohola mundo");
    const dn1 = new SpanDeDeNode(node, "hol", style);
    const dn2 = new SpanDeDeNode(dn1, "mun", style);

    expect(node.getMap()).toEqual([0, 20]);
    expect(dn1.getMap()).toEqual([0, 3, 10, 13, 20]);
    expect(dn2.getMap()).toEqual([0, 3, 5, 8, 10, 13, 15, 18, 20]);
  });
  it("getMap() -> length variation", () => {
    const style = new CSSStyleDeclaration();
    const node = new TextDeNode("hola mundo");
    const dn1 = new SpanDeDeNode(node, "hol", style);
    const dn2 = new SpanDeDeNode(dn1, "la", style);
    const dn3 = new SpanDeDeNode(dn2, "o", style);
    const dn4 = new SpanDeDeNode(dn3, "ola mund", style);

    expect(node.getMap()).toEqual([0, 10]);
    expect(dn1.getMap()).toEqual([0, 3, 10]);
    expect(dn2.getMap()).toEqual([0, 2, 4, 10]);
    expect(dn3.getMap()).toEqual([0, 1, 2, 4, 9, 10]);
    expect(dn4.getMap()).toEqual([0, 1, 9, 10]);
  });
});

export interface IDeNode {
  text: string;

  getFullText(): string;
  getMap(): number[];
}
export class TextDeNode implements IDeNode {
  constructor(public text: string) {}
  getFullText(): string {
    return this.text;
  }
  getMap(): number[] {
    return [0, this.text.length];
  }
}

export abstract class DecoratorDeNode implements IDeNode {
  constructor(private node: IDeNode, public text: string, private style: CSSStyleDeclaration) {}

  getFullText(): string {
    return this.node.getFullText();
  }
  getMap(): number[] {
    const prev = this.node.getMap();
    const current = this.generateMap(this.getFullText(), this.text);

    return this.generateNext(prev, current);
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
  
}

export class SpanDeDeNode extends DecoratorDeNode {}
