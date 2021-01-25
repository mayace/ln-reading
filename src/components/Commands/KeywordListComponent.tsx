import { Component, ReactNode } from "react";
import React from "react";
import { KeywordItem } from "./KeywordItem";
import { IKeywordListProps } from "./IKeywordListProps";
import { ModalComponent } from "../modal/Modal";
import { KeyWordListState } from "./KeyWordListState";
import { KeywordSettingsForm } from "./KeywordSettingsForm";

export class KeywordListComponent extends Component<IKeywordListProps, KeyWordListState> {
  constructor(props: IKeywordListProps) {
    super(props);
    this.state = new KeyWordListState();
  }

  componentDidMount(): void {
    const { defaultText } = this.props;
    this.updateState({ selectedText: defaultText });
  }
  componentDidUpdate(prevProps: IKeywordListProps): void {
    const { defaultText } = this.props;
    if (prevProps.defaultText !== defaultText) {
      this.updateState({ selectedText: defaultText });
    }
  }

  // onChangeKeywordItem(index: number, to: KeywordSettings): void {
  //   const { keywordList, onChange } = this.props;
  //   const newOne = [...keywordList];
  //   newOne[index] = to;
  //   onChange && onChange(newOne, keywordList);
  // }
  updateState<k extends keyof KeyWordListState>(change: Pick<KeyWordListState, k>): Promise<void> {
    return new Promise((resolve) => this.setState(change, resolve));
  }

  render(): ReactNode {
    const { selectedKeyword, selectedText } = this.state;
    return (
      <div className="keyword-list-component">
        {selectedKeyword && (
          <ModalComponent onClose={() => this.updateState({ selectedKeyword: null })}>
            <div className="modal-card">
              <div className="box">
                <KeywordSettingsForm
                  item={selectedKeyword}
                  onCancel={() => this.updateState({ selectedKeyword: null })}
                  onSave={(item) => {
                    this.props.onChange(item);
                    this.updateState({ selectedKeyword: null });
                  }}
                />
              </div>
            </div>
          </ModalComponent>
        )}
        <table className="table is-fullwidth">
          <tbody>
            <tr>
              <td>
                <input
                  value={selectedText}
                  onChange={({ target }) => this.updateState({ selectedText: target.value.trim() })}
                  type="text"
                  className="input"
                />
              </td>
              <td>
                <button onClick={() => 1} type="button" className="button is-primary">
                  <span className="icon">
                    <i className="fas fa-file"></i>
                  </span>
                </button>
              </td>
            </tr>

            {this.props.keywordList.map((item) => {
              return (
                <tr key={item.id}>
                  <td>
                    <KeywordItem
                      keyword={item}
                      onClick={(selectedKeyword) => this.updateState({ selectedKeyword })}
                      onChange={() => 1}
                    />
                  </td>
                  <td>
                    <button type="button" className="button is-danger">
                      <span className="icon">
                        <i className="fas fa-trash"></i>
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
