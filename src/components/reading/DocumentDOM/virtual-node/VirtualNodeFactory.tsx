import { ImageVirtualLeaf } from "./ImageVirtualLeaf";
import { IVirtualNode } from "./IVirtualNode";
import { TextVirtualLeaf } from "./TextVirtualLeaf";
import { RtVirtualNode } from "./RtVirtualNode";
import { RubyVirtualNode } from "./RubyVirtualNode";
import { SpanVirtualNode } from "./SpanVirtualNode";
import { ParagraphVirtualNode } from "./ParagraphVirtualNode";


export class VirtualNodeFactory {
  fromHtml(item: Node): IVirtualNode {
    switch (item.nodeName.toLowerCase()) {
      case "p":
        return new ParagraphVirtualNode();
      case "img":
        return new ImageVirtualLeaf((item as HTMLImageElement).src);
      case "ruby":
        return new RubyVirtualNode();
      case "rt":
        return new RtVirtualNode();
      case "span":
        return new SpanVirtualNode();
    }

    return new TextVirtualLeaf(item.textContent || "");
  }
}
