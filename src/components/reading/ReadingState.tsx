import { ISubscriber } from "../../models/ISubscriber";
import { KeywordSettings } from "../../models/Settings";
import {  ISubscription } from "../../models/Subscription";
import { FeedItem } from "../explorer/FeedItem";
import { ReadingSettings } from "./ReadingSettings";

export interface IReadingState {
  [key: string]: unknown;
  readingSettings: ReadingSettings;
  feedItem: FeedItem;
  keywordList: KeywordSettings[];
  selectedText: string;
  selectedKeyword: KeywordSettings | null;
  nodeList: Node[];
}

export class ReadingState implements IReadingState {
  nodeList: Node[] = [];
  selectedKeyword: KeywordSettings | null = null;
  [key: string]: unknown;
  readingSettings = new ReadingSettings();
  feedItem = new FeedItem();
  keywordList: KeywordSettings[] = [];
  selectedText = "";
}

export interface IReadingStateEvent {
  key: string;
  to: unknown;
  from: unknown;
}

export class Ddd implements IReadingState {
  [key: string]: unknown;
  readingSettings = new ReadingSettings();
  feedItem = new FeedItem();
  keywordList = [];
  selectedText = "";
  selectedKeyword = null;

  subscribers: { [key: string]: ISubscriber<unknown>[] } = {};

  constructor(o: IReadingState) {
    Object.keys(this).forEach((key) => {
      delete this[key];
      Object.defineProperty(this, key, {
        get: () => o[key],
        set: (val) => {
          const prev = o[key];
          o[key] = val;
          this.notifyAll(key, val, prev);
        },
      });
    });
  }
  nodeList: Node[] = [];
  private setupProperties(prevKey: string, obj: { [key: string]: unknown }): void {
    Object.keys(obj).forEach((key) => {
      delete obj[key];
      Object.defineProperty(obj, key, {
        get: () => obj[key],
        set: (val) => {
          const prev = obj[key];
          obj[key] = val;
          this.notifyAll(key, val, prev);
        },
      });
    });
  }

  private notifyAll(key: string, to: unknown, from: unknown): void {
    const list = this.subscribers[key] || [];
    list.forEach((item) => item.next({ to, from }));
  }

  subscribe(key: string, subscriber: ISubscriber<unknown>): ISubscription {
    let list = this.subscribers[key];
    if (!list) {
      this.subscribers[key] = list = [];
    }
    const length = list.length;
    list.push(subscriber);
    return {
      unsubscribe: () => {
        list.splice(length, 1);
      },
    };
  }
}
