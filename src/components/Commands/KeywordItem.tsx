import { ReactElement } from "react";
import { KeywordSettings } from "../../models/Settings";
import React from "react";
import { IKeywordItemProps } from "./Keyword";

export function KeywordItem(props: IKeywordItemProps): ReactElement {
  const { keyword } = props;
  const onChange = (to: Partial<KeywordSettings>) => props.onChange({ ...keyword, ...to });

  return (
    <div className="keyword-item">
      <div className="control">
        <input
          onClick={() => props.onClick(keyword)}
          style={{ backgroundColor: keyword.color || "#280000", color: "#ffcc33" }}
          value={keyword.text}
          onChange={(event) => onChange({ text: event.target.value })}
          type="button"
          className="button is-fullwidth"
        />
      </div>
    </div>
  );
}
