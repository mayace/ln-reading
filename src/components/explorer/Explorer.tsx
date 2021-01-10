import React, { ReactNode } from "react";
import { ModalComponent } from "../modal/Modal";
import { Feed, IFeedInfo, IFeedItemInfo } from "./Feed";

export class ExplorerComponentState {
  feedList: IFeedItemInfo[] = [];
  feedUrlList: string[] = [];
  selectedFeedItem: IFeedItemInfo | null = null;
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
  }

  onPreview(item: IFeedItemInfo): void {
    this.updateState({ selectedFeedItem: item });
  }

  render(): ReactNode {
    const { selectedFeedItem } = this.state;

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
              <div className="modal-card-head">
                <div className="buttons">
                  <a className="button is-primary">
                    <span className="icon">
                      <i className="fas fa-plus"></i>
                    </span>
                  </a>
                  <div className="button is-text">{selectedFeedItem.title}</div>
                </div>
              </div>
              <div className="modal-card-body">
                <div dangerouslySetInnerHTML={{ __html: selectedFeedItem.content }}></div>
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
