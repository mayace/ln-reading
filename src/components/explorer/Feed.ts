
import RssParser from "rss-parser";

export interface IReadingKeywordItem {
    keywordId: string
    pageIndex: number
}

export class FeedItem implements IFeedItemInfo {
    contentSnippet = "";
    title = "";
    description = "";
    link = "";
    isoDate = "";
    //becames the contentKey where is stored
    content = "";
    guid = ""
    isPinned = false
    views = 0
    createdAt = new Date()
    keywordList: IReadingKeywordItem[] = []
}

export interface IFeedInfo {
    title: string;
    description: string;
    link: string;
}
export interface IFeedItemInfo {
    title: string;
    description: string;
    link: string;
    isoDate: string
    content: string;
    guid: string;
    contentSnippet: string
}

export interface IFeed<T, U> {
    parse(): Promise<T & RssParser.Output<U>>;
}

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