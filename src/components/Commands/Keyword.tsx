import { Component, ReactElement, ReactNode } from "react";
import { KeywordSettings } from "../../models/Settings";
import React from "react";

export interface IKeywordListProps {
  keywordList: KeywordSettings[];
  onChange: (to: KeywordSettings[], from: KeywordSettings[]) => void;
}

export class KeywordListComponent extends Component<IKeywordListProps> {
  onChangeKeywordItem(index: number, to: KeywordSettings): void {
    const { keywordList, onChange } = this.props;
    const newOne = [...keywordList];
    newOne[index] = to;
    onChange && onChange(newOne, keywordList);
  }

  render(): ReactNode {
    return (
      <div className="keyword-list-component">
        <table className="table is-fullwidth">
          <tbody>
            {this.props.keywordList.map((item, index) => {
              return (
                <tr key={item.id}>
                  <td>
                    <KeywordItem
                      keyword={item}
                      onChange={(to) => this.onChangeKeywordItem(index, to)}
                    />
                    {/* {index === this.props.keywordList.length - 1 && (
                      <button
                        onClick={() => {
                          const { keywordList, onChange } = this.props;
                          const newOne = [...keywordList];
                          newOne.push({ color: "#ffffff", isGlobal: false, text: "" });
                          onChange && onChange(newOne, keywordList);
                        }}
                        className="button is-primary"
                        type="button"
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    )} */}
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

export interface IKeywordItemProps {
  keyword: KeywordSettings;
  onChange: (to: KeywordSettings) => void;
}

export function KeywordItem(props: IKeywordItemProps): ReactElement {
  const { keyword } = props;
  const onChange = (to: Partial<KeywordSettings>) => props.onChange({ ...keyword, ...to });

  return (
    <div className="keyword-item">
      {/* <div className="control">
        <label className="button" style={{ backgroundColor: keyword.color }}>
          <i className="fas fa-circle" style={{ color: keyword.color }}></i>
          <input
            value={keyword.color}
            onChange={(event) => onChange({ color: event.target.value })}
            type="color"
            style={{ display: "none" }}
          />
        </label>
      </div> */}
      <div className="control">
        <input
          style={{ backgroundColor: "#280000", color: "#ffcc33" }}
          value={keyword.text}
          onChange={(event) => onChange({ text: event.target.value })}
          type="button"
          className="button"
        />
      </div>
    </div>
  );
}
