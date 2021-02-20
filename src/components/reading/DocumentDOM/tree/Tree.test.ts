import { TextVirtualLeaf } from "../virtual-node/TextVirtualLeaf";

export interface IComp {
  accept(visitor: IVisitor): void;
}
export class NodeComp implements IComp {
  private children: NodeComp[] = [];
  private _text = "";

  get text(): string {
    if (this.hasChildren()) {
      return this.children.map((item) => item.text).reduce((prev, current) => `${prev}${current}`);
    }
    return this._text;
  }

  get the(): number[] {
    if (this.hasChildren()) {
      this.children.reduce((prev: number[], current) => prev.concat(current.the), []);
    }
    return [0, this._text.length];
  }

  constructor(text: string) {
    this._text = text;
  }

  hasChildren(): boolean {
    return this.children.length > 0;
  }
  removeAll(): NodeComp[] {
    return this.children.splice(0);
  }
  create(...comp: NodeComp[]): number {
    return this.children.push(...comp);
  }

  accept(visitor: IVisitor): void {
    visitor.visit(this);
  }
}
export interface IVisitor {
  visit(comp: NodeComp): void;
}

export class CreationalVisitor implements IVisitor {
  constructor(private text: string) {}
  visit(comp: NodeComp): void {
    const source = comp.text;
    const target = this.text;
    const regExp = new RegExp(target, "mg");

    if (comp.hasChildren()) {
    } else {
      let match: RegExpExecArray | null;
      const l: number[] = [];
      while ((match = regExp.exec(source))) {
        l.push(match.index);
        l.push(match.index + target.length);
      }

      console.log(comp.the);
      console.log(l)

      //   let prev = 0;
      //   l.forEach((item) => {
      //     if (item > 0) {
      //       console.log([prev, item]);
      //       // console.log(source.substring(prev, item));
      //       //   comp.create(new NodeComp(source.substring(prev, item)));
      //     }
      //     prev = item + target.length;
      //     console.log([item, prev]);
      //     // console.log(source.substring(item, prev));
      //     // comp.create(new NodeComp(source.substring(item, prev)));
      //   });

      //   if (prev < source.length) {
      //     console.log([prev, source.length]);
      //     // console.log(source.substring(prev, source.length));
      //     // comp.create(new NodeComp(source.substring(prev, source.length)));
      //   }
    }
  }
}

describe("tree", () => {
  it("test1", () => {
    const txt = new NodeComp("cesar");
    const v1 = new CreationalVisitor("ces");
    txt.accept(v1);

    //   const text = "cesar";
    //   const keywordList = ["ces", "sar", "esa"];

    // 0|_|_|_|_|5
    // 0|_|_|3|_|_
    // _|_|2|_|_|5
    // _|1|_|_|4|_
    // -------------------
    // 0|1|2|3|4|5

    // 0|_|_|_|_|5
    // 0|_|_|3|_|_
    // ------------------
    // 0|_|_|3|_|5
    // _|_|2|_|_|5
    // -----------------
    // 0|_|2|_|_|5
    // _|1|_|_|4|_
    // -------------------
    // 0|1|_|_|4|5

    // cesar
    //   ces ar
    //   ce sar
    //   c esa r
    //   keywordList.forEach(item => {
    //       text.indexOf
    //   })
    // console.log(1);
  });
});
