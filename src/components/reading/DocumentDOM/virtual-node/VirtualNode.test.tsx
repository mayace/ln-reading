import { RtVirtualNode } from "./RtVirtualNode";
import { RubyVirtualNode } from "./RubyVirtualNode";
import { SpanVirtualNode } from "./SpanVirtualNode";
import { ParagraphVirtualNode } from "./ParagraphVirtualNode";
import { VirtualNodeFactory } from "./VirtualNodeFactory";
import { ImageVirtualLeaf } from "./ImageVirtualLeaf";
import { TextVirtualLeaf } from "./TextVirtualLeaf";

describe("virtual", () => {
  it("fromHtml", () => {
    const other = document.createElement("div");
    const img = document.createElement("img");
    const text = document.createTextNode("");
    const p = document.createElement("p");
    const ruby = document.createElement("ruby");
    const rt = document.createElement("rt");
    const span = document.createElement("span");

    const factory = new VirtualNodeFactory();
    const otherVN = factory.fromHtml(other);
    const imgVN = factory.fromHtml(img);
    const pVN = factory.fromHtml(p);
    const textVN = factory.fromHtml(text);
    const rubyVN = factory.fromHtml(ruby);
    const rtVN = factory.fromHtml(rt);
    const spanVN = factory.fromHtml(span);

    expect(otherVN instanceof TextVirtualLeaf).toBe(true);
    expect(imgVN instanceof ImageVirtualLeaf).toBe(true);
    expect(pVN instanceof ParagraphVirtualNode).toBe(true);
    expect(textVN instanceof TextVirtualLeaf).toBe(true);
    expect(rubyVN instanceof RubyVirtualNode).toBe(true);
    expect(rtVN instanceof RtVirtualNode).toBe(true);
    expect(spanVN instanceof SpanVirtualNode).toBe(true);
  });

  it("client", () => {
    const p = new ParagraphVirtualNode();
    const t = new TextVirtualLeaf("hola mundo");
    p.create(t);

    expect(p.text).toEqual("hola mundo")
    expect(p.toHtml().textContent).toEqual("hola mundo")
  });
});
