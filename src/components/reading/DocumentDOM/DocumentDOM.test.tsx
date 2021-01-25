import { DocumentDOM } from "./DocumentDOM";
import { JpNode } from "./JpNode";
import { JpNodeType } from "./JpNodeType";
import React from "react";
import { mount, shallow } from "enzyme";

describe("JpNode", () => {
  it("createChild", () => {
    const node = new JpNode(JpNodeType.text, "hola mundo", 0);

    node.createChild(1, 2, JpNodeType.span);
    expect(node.text).toEqual("hola mundo");
    //0 validation
    expect(node.getChildren(0, 0)).toHaveLength(0);
    expect(node.getChildren(1, 1)).toHaveLength(0);
    //negative diff validation
    expect(node.getChildren(10, 0)).toHaveLength(0);
    expect(node.getChildren(11, 4)).toHaveLength(0);
    //outer validation
    expect(node.getChildren(0)).toHaveLength(3);
    expect(node.getChildren(0, 2)).toHaveLength(2);
    //left validation
    expect(node.getChildren(0, 2)).toHaveLength(2);
    //inner validation
    expect(node.getChildren(0, 1)).toHaveLength(1);
    expect(node.getChildren(1, 2)).toHaveLength(1);
    //right validation
    expect(node.getChildren(1, 3)).toHaveLength(2);
    expect(node.getChildren(2)).toHaveLength(1);
  });
  it("createChild() // ruby and rt", () => {
    const el = document.createElement("div");
    el.innerHTML = `hola mundo<ruby>!<rt>???</rt></ruby>`;
    const node = JpNode.fromHtml(el);

    // SPAN ROOT
    expect((node.toHtml() as HTMLElement).nodeName).toEqual("SPAN");

    //0 SPAN INSIDE
    expect((node.toHtml() as HTMLElement).querySelectorAll("span")).toHaveLength(0);

    expect(node.start).toEqual(0);
    expect(node.length).toEqual(11);

    const rubyRange = node.getChildren(10, 11);
    expect(rubyRange).toHaveLength(1);

    const rubyEl = rubyRange[0];
    expect(rubyEl.toHtml().nodeName).toEqual("RUBY");
    expect(rubyEl.start).toEqual(10);
    expect(rubyEl.length).toEqual(1);
    expect(rubyEl.text).toEqual("!");

    expect(rubyEl.getChildren(0)).toHaveLength(1);

    const rubyChildEl = rubyEl.getChildren(0)[0];
    expect(rubyChildEl.toHtml().nodeName).toEqual("#text");
    expect(rubyChildEl.start).toEqual(10);
    expect(rubyChildEl.length).toEqual(1);
    expect(rubyChildEl.text).toEqual("!");

    // 2 SPAN INSIDE
    node.createChild(10, 11, JpNodeType.span);
    expect((node.toHtml() as HTMLElement).querySelectorAll("span")).toHaveLength(2);

    // 2 SPAN INSIDE
    node.createChild(10, 11, JpNodeType.span);
    expect((node.toHtml() as HTMLElement).querySelectorAll("span")).toHaveLength(3);
  });
  it("createChild() // with whitespace", () => {

    const el = document.createElement("div");
    el.innerHTML = `<ruby>hola <rt>hello</rt></ruby> mundo<ruby>!<rt>???</rt></ruby>`;
    const node = JpNode.fromHtml(el);

     // hola
     node.createChild(0, 4, JpNodeType.span);
     expect((node.toHtml() as HTMLElement).querySelectorAll("span")).toHaveLength(2);

    // la mu
     node.createChild(2, 7, JpNodeType.span);
     expect((node.toHtml() as HTMLElement).querySelectorAll("span")).toHaveLength(7);
  });
});

describe("DocumentDOM", () => {
  it("ref contentElement", () => {
    const wrapper = mount<DocumentDOM>(<DocumentDOM KeywordList={[]} onTextSelected={() => 1} />);
    expect(wrapper.instance().contentElement).toBeTruthy();
  });
  it("changeText() //1 Match", () => {
    const wrapper = mount<DocumentDOM>(<DocumentDOM KeywordList={[]} onTextSelected={() => 1} />);
    const instance = wrapper.instance();
    expect(instance.contentElement?.querySelectorAll("span")).toHaveLength(0);

    const p = document.createElement("p");
    p.appendChild(document.createTextNode("hola mundo"));
    instance.changeText([p]);
    expect(instance.contentElement?.querySelectorAll("span")).toHaveLength(1);

    instance.props.KeywordList.push({ text: "hola", color: "#ffffff" });
    instance.changeText([p]);
    expect(instance.contentElement?.querySelectorAll("span")).toHaveLength(3);

    instance.props.KeywordList.push({ text: "ndo", color: "#ffffff" });
    instance.changeText([p]);
    expect(instance.contentElement?.querySelectorAll("span")).toHaveLength(5);

    expect(instance.contentElement?.textContent).toEqual("hola mundo");
  });

  it("changeText() //Multiple matches", () => {
    const wrapper = mount<DocumentDOM>(<DocumentDOM KeywordList={[]} onTextSelected={() => 1} />);
    const instance = wrapper.instance();
    expect(instance.contentElement?.querySelectorAll("span")).toHaveLength(0);

    const p = document.createElement("p");
    p.appendChild(document.createTextNode("hola mundo!"));
    instance.changeText([p]);
    expect(instance.contentElement?.querySelectorAll("span")).toHaveLength(1);

    instance.props.KeywordList.push({ text: "o", color: "#ffffff" });
    instance.changeText([p]);
    expect(instance.contentElement?.querySelectorAll("span")).toHaveLength(5);

    expect(instance.contentElement?.textContent).toEqual("hola mundo!");
  });

  it("changeText() //ruby and rt matches", () => {
    const wrapper = mount<DocumentDOM>(<DocumentDOM KeywordList={[]} onTextSelected={() => 1} />);
    const instance = wrapper.instance();
    expect(instance.contentElement?.querySelectorAll("span")).toHaveLength(0);

    const p = document.createElement("div");
    p.innerHTML = "<ruby>hola <rt>hello</rt></ruby>mundo<ruby>!<rt>?</rt></ruby>";
    const jpNode = JpNode.fromHtml(p);

    instance.changeText([p]);
    expect(instance.contentElement?.querySelectorAll("span")).toHaveLength(1);
    expect(instance.contentElement?.querySelectorAll("ruby")).toHaveLength(2);
    expect(instance.contentElement?.querySelectorAll("rt")).toHaveLength(2);

    // rt is ignored when creating childs
    instance.props.KeywordList.push({ text: "hello", color: "#ffffff" });
    instance.props.KeywordList.push({ text: "\\?", color: "#ffffff" });
    instance.changeText([p]);
    expect(instance.contentElement?.querySelectorAll("span")).toHaveLength(1);

    instance.props.KeywordList.push({ text: "h", color: "#ffffff" });
    instance.changeText([p]);
    expect(instance.contentElement?.querySelectorAll("span")).toHaveLength(3);

    instance.props.KeywordList.push({ text: "la mu", color: "#ffffff" });
    instance.changeText([p]);
    expect(instance.contentElement?.querySelectorAll("span")).toHaveLength(7);

    instance.props.KeywordList.push({ text: "!", color: "#ffffff" });
    instance.changeText([p]);
    expect(instance.contentElement?.querySelectorAll("span")).toHaveLength(9);

    expect(jpNode.text).toEqual("hola mundo!");
  });
});
