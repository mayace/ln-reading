import React, { ReactElement, ReactNode } from "react";
import { ModalComponent } from "../modal/Modal";
import { ExplorerComponentState } from "./ExplorerComponentState";
import { Feed } from "./Feed";
import { FeedItem } from "./FeedItem";
import { IFeedItemInfo } from "./IFeedItemInfo";
import { IExplorerComponentProps } from "./IExplorerComponentProps";
import Parser from "rss-parser";
import { IFeedItemExtras } from "./IFeedItemExtras";

export class ExplorerComponent extends React.Component<
  IExplorerComponentProps,
  ExplorerComponentState
> {
  feed = new Feed("");
  get sortedFeedList(): (IFeedItemInfo & IFeedItemExtras)[] {
    return this.state.feedList;
  }

  constructor(props: IExplorerComponentProps) {
    super(props);
    this.state = new ExplorerComponentState();
    this.state.feedUrlList.push("https://nhkeasier.com/feed");
  }

  updateState<K extends keyof ExplorerComponentState>(
    change: Pick<ExplorerComponentState, K>,
  ): Promise<void> {
    return new Promise((resolve) => this.setState(change, resolve));
  }

  componentDidMount(): void {
    const { bookmarkService, feedItemService } = this.props.service;

    type t = Parser.Item & IFeedItemInfo & IFeedItemExtras;

    feedItemService.getAll().then((feedItemList) => {
      this.state.feedUrlList.forEach((item) =>
        this.feed
          .parse(item)
          .then((body) => {
            return body.items.map((jtem) => {
              const ktem: t = { ...jtem, bookmarked: false };
              const found = feedItemList.find((ltem) => ltem.guid === ktem.guid);
              ktem.bookmarked = found ? true : false;
              return ktem;
            });
          })
          .then((feedList) => this.updateState({ feedList })),
      );
    });

    bookmarkService.read().then((bookmarkSettings) => this.updateState({ bookmarkSettings }));
  }

  onPreview(item: IFeedItemInfo & IFeedItemExtras): void {
    // this.updateState({ selectedFeedItem: item });
  }

  fixRelativeUrl(content: string, domain: string): string {
    return content.replace(/(src|href)="\/([^"]+)"/gm, `$1="${domain}/$2"`);
  }

  bookmark(item: IFeedItemInfo & IFeedItemExtras, content: string): void {
    const { bookmarkSettings } = this.state;
    const { feedItemService, bookmarkService } = this.props.service;
    const entry: FeedItem = { ...new FeedItem(), ...item };

    item.bookmarked = true;
    entry.content = entry.guid;
    entry.contentSnippet = entry.contentSnippet.substr(0, 95);
    feedItemService.create(entry);

    this.updateState({ bookmarkSettings });
    bookmarkService.save(bookmarkSettings);

    window.localStorage.setItem(entry.guid, content);
  }
  unbookmark(item: IFeedItemInfo & IFeedItemExtras): void {
    const { bookmarkSettings } = this.state;
    const { feedItemService, bookmarkService } = this.props.service;

    item.bookmarked = false;
    feedItemService.delete(item.guid);

    this.updateState({ bookmarkSettings });
    bookmarkService.save(bookmarkSettings);
    window.localStorage.removeItem(item.guid);
  }

  date_displayer(date: Date): JSX.Element {
    const month = `00${date.getMonth()}`.slice(-2);
    const day = `00${date.getDate()}`.slice(-2);

    const hours = `00${date.getHours()}`.slice(-2);
    const minutes = `00${date.getMinutes()}`.slice(-2);
    const seconds = `00${date.getSeconds()}`.slice(-2);

    return (
      <span>
        {date.getFullYear()}-{month}-{day} {hours}:{minutes}:{seconds}
      </span>
    );
  }

  render(): ReactNode {
    const { selectedFeedItem } = this.state;

    const selectedContentFixed = selectedFeedItem
      ? this.fixRelativeUrl(selectedFeedItem.content, "https://nhkeasier.com")
      : "";

    return (
      <div className="explorer-component">
        {selectedFeedItem && (
          <ModalComponent onClose={() => this.updateState({ selectedFeedItem: null })}>
            <div className="modal-card">
              <header className="modal-card-head">
                <div className="control">
                  {selectedFeedItem.bookmarked ? (
                    <a
                      onClick={() => this.unbookmark(selectedFeedItem)}
                      className="button is-danger"
                    >
                      <span className="icon">
                        <i className="fas fa-ban"></i>
                      </span>
                    </a>
                  ) : (
                    <a
                      onClick={() => this.bookmark(selectedFeedItem, selectedContentFixed)}
                      className="button is-primary"
                    >
                      <span className="icon">
                        <i className="fas fa-bookmark"></i>
                      </span>
                    </a>
                  )}
                </div>
                <div className="px-3" style={{ flexGrow: 1 }}>
                  <strong>{selectedFeedItem.title}</strong>
                </div>
              </header>
              <div className="modal-card-body">
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedContentFixed,
                  }}
                ></div>
              </div>
            </div>
          </ModalComponent>
        )}

        {this.sortedFeedList.map((item) => {
          return (
            <div key={item.title} className="box">
              <div className="columns">
                <div className="column is-2">
                  <div className="has-text-centered">
                    {this.date_displayer(new Date(item.isoDate))}
                  </div>
                </div>
                <div className="column">
                  <div>
                    <a onClick={() => this.onPreview(item)}>{item.title}</a>
                  </div>
                  <div>
                    <a href={item.link} target="blank">
                      <span className="icon">
                        <i className="fas fa-link"></i>
                      </span>
                    </a>
                    {item.bookmarked && (
                      <span className="icon">
                        <i className="fas fa-bookmark"></i>
                      </span>
                    )}
                    {this.state.bookmarkSettings.selectedGuid === item.guid && (
                      <span className="icon">
                        <i className="fas fa-book-reader"></i>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
