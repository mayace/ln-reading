import { Component, ReactElement, ReactNode } from "react";
import { KeywordSettings } from "../../models/Settings";
import React from "react";

export interface IKeywordListProps {
  keywordList: KeywordSettings[];
  onStateChanged: (to: KeywordSettings[], from: KeywordSettings[]) => void;
}

export class KeywordListComponent extends Component<IKeywordListProps> {
  componentDidUpdate(): void {
    const { keywordList, onStateChanged } = this.props;
    if (keywordList.length === 0) {
      onStateChanged && onStateChanged([new KeywordSettings()], keywordList);
    }
  }

  render(): ReactNode {
    return (
      <div className="keywords-component">
        <table>
          <tbody>
            {this.props.keywordList.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    <KeywordItem
                      onChangeValue={(to) => {
                        const { keywordList, onStateChanged } = this.props;
                        const newOne = [...keywordList];
                        newOne[index] = to;
                        onStateChanged && onStateChanged(newOne, keywordList);
                      }}
                      keyword={item}
                    />
                    {index === this.props.keywordList.length - 1 && (
                      <button
                        onClick={() => {
                          const { keywordList, onStateChanged } = this.props;
                          const newOne = [...keywordList];
                          newOne.push({ color: "#ffffff", isGlobal: false, text: "" });
                          onStateChanged && onStateChanged(newOne, keywordList);
                        }}
                        className="button is-primary"
                        type="button"
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    )}
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

export function KeywordItem({
  keyword,
  onChangeValue,
}: {
  keyword: KeywordSettings;
  onChangeValue?: (to: KeywordSettings) => void;
}): ReactElement {
  const onChange = (to: Partial<KeywordSettings>) =>
    onChangeValue && onChangeValue({ ...keyword, ...to });
  return (
    <div className="field has-addons keyword-item">
      <div className="control">
        <label className="button" style={{ backgroundColor: keyword.color }}>
          <i className="fas fa-circle" style={{ color: keyword.color }}></i>
          <input
            value={keyword.color}
            onChange={(event) => onChange({ color: event.target.value })}
            type="color"
            style={{ display: "none" }}
          />
        </label>
      </div>
      <div className="control">
        <input
          value={keyword.text}
          onChange={(event) => onChange({ text: event.target.value })}
          type="text"
          className="input"
        />
      </div>
    </div>
  );
}
