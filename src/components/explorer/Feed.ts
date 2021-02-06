
import RssParser from "rss-parser";
import { IFeed } from "./IFeed";
import { IFeedInfo } from "./IFeedInfo";
import { IFeedItemInfo } from "./IFeedItemInfo";

export class Feed implements IFeed<IFeedInfo, IFeedItemInfo>{
    private proxy = "http://localhost:8080";
    private parser = new RssParser<IFeedInfo, IFeedItemInfo>();

    constructor(private url: string) { }
    async parse(url?: string): Promise<IFeedInfo & RssParser.Output<IFeedItemInfo>> {
        if (url)
            this.url = url;
        return await this.parser.parseURL(`${this.proxy}/${this.url}`);
    }
}
// export class Feed implements BaseFeed {
// }

// export  class DecoratorFeed implements BaseFeed {

//     constructor(private decorator:BaseFeed){}
//     async parse(): Promise<IFeedInfo & RssParser.Output<IFeedItemInfo>> {

//         const ret = await this.decorator.parse();
//         ret.items = [...ret.items, ]

//         return ret;
//     }

//     dude():Promise<

// }

// export abstract class BaseFeed<T, U> implements IFeed {
//   private proxy = "https://cors-anywhere.herokuapp.com";
//   private parser = new RssParser<T, U>();
//   url: string;
//   constructor(url: string) {
//     this.url = url;
//   }
//   parse(): Promise<T & RssParser.Output<U>> {
//     return this.parser.parseURL(`${this.proxy}/${this.url}`);
//   }
// }

// export class NhkeasierFeed extends BaseFeed<IFeedInfo, IFeedItemInfo> {
//     constructor(url?: string) {
//         super(url || "https://nhkeasier.com/feed");
//     }
// }