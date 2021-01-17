import { cloneDeep } from "lodash";
import React, { ReactNode } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Subscription } from "../../models/Subscription";
import {
  BookmarkDateMode,
  BookmarkLocalStorageService,
  BookmarkSettings,
  BookmarkSortMode,
  BookmarkViewMode,
} from "../../services/Bookmark";

export class PanelState {
  bookmarkSettings = new BookmarkSettings();
}
export interface IPanelProps {
  bookmarkServiceKey: string;
}

export interface IPanelSubscription {
  from: BookmarkSettings;
  to: BookmarkSettings;
}

export class PanelComponent extends React.Component<IPanelProps & RouteComponentProps, PanelState> {
  state: PanelState = new PanelState();

  bookmarkService: BookmarkLocalStorageService;
  subscription = new Subscription<IPanelSubscription>();

  constructor(props: IPanelProps & RouteComponentProps) {
    super(props);
    this.bookmarkService = new BookmarkLocalStorageService(props.bookmarkServiceKey);
    this.subscription.subscribe({
      next: ({ to }) => this.bookmarkService.save(to),
    });
  }

  componentDidMount(): void {
    this.bookmarkService.read().then((bookmarkSettings) => this.updateState({ bookmarkSettings }));
  }

  updateState<T extends keyof PanelState>(change: Pick<PanelState, T>): Promise<void> {
    return new Promise((resolve) => {
      this.setState(change, () => resolve());
    });
  }

  updateBookmarkSettings(change: Partial<BookmarkSettings>): void {
    const from = cloneDeep(this.state.bookmarkSettings);
    const bookmarkSettings = { ...this.state.bookmarkSettings, ...change };
    this.updateState({ bookmarkSettings }).then(() => {
      this.subscription.notifyAll({ from, to: bookmarkSettings });
      this.props.history.push("/reading");
    });
  }

  render(): ReactNode {
    const {
      bookmarkSettings: { FeedItemList, viewMode, sortMode, dateMode },
    } = this.state;
    return (
      <div className="panel-component">
        <div className="field is-grouped">
          <div className="control">
            <button
              className={viewMode === BookmarkViewMode.grid ? "button is-dark" : "button"}
              onClick={() => this.updateBookmarkSettings({ viewMode: BookmarkViewMode.grid })}
              type="button"
            >
              <span className="icon">
                <i className="fas fa-grip-horizontal"></i>
              </span>
            </button>
          </div>
          <div className="control">
            <button
              className={viewMode === BookmarkViewMode.rows ? "button is-dark" : "button"}
              onClick={() => this.updateBookmarkSettings({ viewMode: BookmarkViewMode.rows })}
              type="button"
            >
              <span className="icon">
                <i className="fas fa-grip-lines"></i>
              </span>
            </button>
          </div>
          <div className="control">
            <button type="button" className="button is-static">
              <span>&nbsp;</span>
            </button>
          </div>
          <div className="control">
            <button
              className={sortMode === BookmarkSortMode.date ? "button is-black" : "button"}
              onClick={() => this.updateBookmarkSettings({ sortMode: BookmarkSortMode.date })}
              type="button"
            >
              <span className="icon">
                <i className="fas fa-calendar"></i>
              </span>
            </button>
          </div>
          <div className="control">
            <button
              className={sortMode === BookmarkSortMode.views ? "button is-black" : "button"}
              onClick={() => this.updateBookmarkSettings({ sortMode: BookmarkSortMode.views })}
              type="button"
            >
              <span className="icon">
                <i className="fas fa-mouse"></i>
              </span>
            </button>
          </div>
          <div className="control">
            <div className="select">
              <select
                value={dateMode}
                onChange={({ target }) =>
                  this.updateBookmarkSettings({ dateMode: parseInt(target.value) })
                }
              >
                <option value={BookmarkDateMode.day}>Day</option>
                <option value={BookmarkDateMode.week}>Week</option>
                <option value={BookmarkDateMode.month}>Moth</option>
                <option value={BookmarkDateMode.year}>Year</option>
                <option value={BookmarkDateMode.all}>All</option>
              </select>
            </div>
          </div>
          {/* todo: number of elment in page */}
          {/* <div className="control">
            <input type="text" className="input" value="10" />
          </div> */}
        </div>
        <div className="columns is-multiline">
          {FeedItemList.map((item) => {
            return (
              <div
                className={viewMode === BookmarkViewMode.grid ? "column is-4" : "column is-12"}
                key={item.guid}
              >
                <div className="box">
                  <div className="title is-5">
                    <a onClick={() => this.updateBookmarkSettings({ selectedGuid: item.guid })}>
                      {item.title}
                    </a>
                  </div>
                  <div>{item.contentSnippet} ...</div>
                </div>
              </div>
            );
          })}

          <div className="column is-4">
            <div className="box">
              <div className="title">New from:</div>
              <div className="content">
                <p>
                  <a href="#">Nhk easy news</a>
                </p>
                <p>File</p>
                <p>Url:</p>
                <p>text</p>
              </div>
            </div>
          </div>

          <div className="column is-4">
            <div className="box">
              <div className="has-text-centered">
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
