import React, { ReactNode } from "react";
import { BookmarkLocalStorageService, IService, BookmarkSettings } from "../../services/Bookmark";
import { ModalComponent } from "../modal/Modal";
import { Feed, FeedItem, IFeedItemInfo } from "./Feed";

export class ExplorerComponentState {
  feedList: IFeedItemInfo[] = [];
  feedUrlList: string[] = [];
  selectedFeedItem: IFeedItemInfo | null = null;
  bookmarkSettings = new BookmarkSettings();
}
export interface IExplorerComponentProps {
  test?: string;
}

export class ExplorerComponent extends React.Component<
  IExplorerComponentProps,
  ExplorerComponentState
> {
  state = new ExplorerComponentState();
  feed = new Feed("");
  bookmarkService: IService<BookmarkSettings> = new BookmarkLocalStorageService(
    "bookmarkServiceKey"
  );

  constructor(props: IExplorerComponentProps) {
    super(props);
    this.state.feedUrlList.push("https://nhkeasier.com/feed");
  }

  get sortedFeedList(): IFeedItemInfo[] {
    return this.state.feedList;
  }

  updateState<K extends keyof ExplorerComponentState>(
    change: Pick<ExplorerComponentState, K>
  ): void {
    this.setState(change);
  }

  componentDidMount(): void {
    this.state.feedUrlList.forEach((item) =>
      this.feed.parse(item).then((body) => this.setState({ feedList: body.items }))
    );

    this.bookmarkService.read().then((bookmarkSettings) => this.updateState({ bookmarkSettings }));
  }

  onPreview(item: IFeedItemInfo): void {
    this.updateState({ selectedFeedItem: item });
  }

  fixRelativeUrl(content: string, domain: string): string {
    return content.replace(/(src|href)="\/([^"]+)"/gm, `$1="${domain}/$2"`);
  }

  bookmark(item: IFeedItemInfo, content: string): void {
    const { bookmarkSettings } = this.state;
    const entry: FeedItem = { ...new FeedItem(), ...item };

    entry.content = entry.guid;
    entry.contentSnippet = entry.contentSnippet.substr(0, 95);
    bookmarkSettings.FeedItemList.push(entry);

    this.updateState({ bookmarkSettings });
    this.bookmarkService.save(bookmarkSettings);

    window.localStorage.setItem(entry.guid, content);

    // this.bookmarkService.read().then((settings) => {
    //   this.bookmarkService.save(settings);
    // });
  }
  unbookmark(index: number): void {
    const { bookmarkSettings } = this.state;
    const deleted = bookmarkSettings.FeedItemList.splice(index, 1);

    this.updateState({ bookmarkSettings });
    this.bookmarkService.save(bookmarkSettings);

    deleted.forEach((item) => window.localStorage.removeItem(item.guid));
  }

  render(): ReactNode {
    const { selectedFeedItem, bookmarkSettings } = this.state;
    const savedIndex = bookmarkSettings.FeedItemList.findIndex(
      (item) => item.guid === selectedFeedItem?.guid
    );
    const savedFeedItem = bookmarkSettings.FeedItemList[savedIndex];

    const selectedContentFixed = selectedFeedItem
      ? this.fixRelativeUrl(selectedFeedItem.content, "https://nhkeasier.com")
      : "";

    return (
      <div className="explorer-component">
        {/* <div className="columns">
          <div className="column">
            <div className="control">
              <button type="button" className="button is-primary">
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
              </button>
            </div>
          </div>
        </div> */}

        {selectedFeedItem && (
          <ModalComponent onClose={() => this.updateState({ selectedFeedItem: null })}>
            <div className="modal-card">
              <header className="modal-card-head">
                <div className="control">
                  {savedFeedItem ? (
                    <a onClick={() => this.unbookmark(savedIndex)} className="button is-danger">
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
                <div className="column is-2">NHK easier</div>
                <div className="column">
                  <div>
                    <strong>{new Date(Date.parse(item.isoDate)).toLocaleString("es-gt")}</strong>
                    <a href={item.link} target="blank">
                      <span className="icon">
                        <i className="fas fa-link"></i>
                      </span>
                    </a>
                  </div>
                  <div>
                    <a onClick={() => this.onPreview(item)}>{item.title}</a>
                  </div>
                  {/* <div>
                    <div className="buttons">
                      <a className="button is-link is-small is-outlined">
                        <span className="icon">
                          <i className="fas fa-eye"></i>
                        </span>
                      </a>
                      <a className="button is-success is-small is-outlined">
                        <span className="icon">
                          <i className="fas fa-plus"></i>
                        </span>
                      </a>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
