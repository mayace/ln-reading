import RssParser from "rss-parser";


export interface IFeed<T, U> {
    parse(): Promise<T & RssParser.Output<U>>;
}
