import { SpanHtmlNode } from "./SpanHtmlNode";
import { TextHtmlNode } from "./TextHtmlNode";

describe("HtmlNode tests", () => {
  it("text node", () => {
    const text1 = new TextHtmlNode("hola mundo!");

    expect(text1.getMap()).toEqual([0, 11]);
    expect(text1.getText()).toEqual("hola mundo!");
    expect(text1.getHtml() instanceof Text).toEqual(true);
  });

  it("span node", () => {
    const text1 = new TextHtmlNode("hola mundo!");
    const span1 = new SpanHtmlNode(new TextHtmlNode("o"));
    text1.append(span1);

    expect(text1.getMap()).toEqual([0, 1, 2, 9, 10, 11]);
    expect(text1.getText()).toEqual("hola mundo!");
    expect(text1.getHtml() instanceof Text).toEqual(true);
    expect(text1.getHtmlMap().length).toEqual(5);
    expect(span1.getMap()).toEqual([0, 1]);
    expect(span1.getText()).toEqual("o");
    expect(span1.getHtml() instanceof HTMLSpanElement).toEqual(true);
    expect(span1.getHtmlMap().length).toEqual(1);
  });

  it("double span node", () => {
    const text1 = new TextHtmlNode("hola mundo!");
    const span1 = new SpanHtmlNode(new TextHtmlNode("o"));
    text1.append(span1);

    const span2 = new SpanHtmlNode(text1);

    expect(span2.getText()).toEqual("hola mundo!");
    expect(span2.getHtml() instanceof HTMLSpanElement).toEqual(true);
    expect(span2.getMap()).toEqual([0, 11]);
    expect(span2.getHtmlMap().length).toEqual(1);

    span2.append(new TextHtmlNode("hola"));

    expect(span2.getMap()).toEqual([0, 4, 11]);
  });
});
