import { ILinkedComposite } from "./IComposite";
import { HtmlNodeIterator } from "./IIterator";
import { INode } from "./INode";

export type NodeMapType = { node: BaseHtmlNode; map: number[] };

export abstract class BaseHtmlNode implements INode, ILinkedComposite<BaseHtmlNode> {
  private __next: BaseHtmlNode | undefined;
  private __style = new CSSStyleDeclaration();
  private __text: string;

  constructor(text: string) {
    this.__text = text;
  }

  abstract getHtml(): Node;
  abstract getHtml(text: string): Node;

  getStyle(): CSSStyleDeclaration {
    return this.__style;
  }

  getText(): string {
    return this.__text;
  }

  getNodeMapList(): NodeMapType[] {
    const iterator = new HtmlNodeIterator(this);
    const nodeList: NodeMapType[] = [{ node: this, map: [0, this.__text.length] }];

    while (iterator.hasNext()) {
      const node = iterator.next();
      const map = this.generateMap(this.__text, node.__text);
      nodeList.push({ node, map });
    }

    return nodeList;
  }
  getMap(): number[] {
    return this.getNodeMapList().reduce(
      (prev, current) => (prev.length > 0 ? this.generateNext(prev, current.map) : current.map),
      [] as number[],
    );
  }

  getHtmlMap(): Node[] {
    const map = this.getMap();
    const list = this.getNodeMapList();

    const nodeList: Node[] = [];
    list.reverse();
    for (let index = 0; index < map.length - 1; index++) {
      const i1 = map[index];
      const i2 = map[index + 1];
      const found = list.find((item) => this.hasMapRange(item.map, i1, i2));
      const text = this.__text.substring(i1, i2);

      nodeList.push(found ? found.node.getHtml(text) : this.getHtml(text));
    }

    return nodeList;
  }

  append(node: BaseHtmlNode): BaseHtmlNode {
    return (this.__next = node);
  }
  getNext(): BaseHtmlNode | undefined {
    return this.__next;
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

  private hasMapRange(map: number[], initial: number, final: number): boolean {
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
