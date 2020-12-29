import { DocumentSettings } from "../../models/Settings";
import { ITryToChange } from "./TryToChangeHOC";
import React from "react";


export function FontSizeCommand(
  props: { document: DocumentSettings } & ITryToChange<DocumentSettings>
) {
  const { document } = props;

  const onChange = (to: any) => {
    const from = props.document;
    props.onTryToChange({ ...from, ...to }, from);
  };

  return (
    <div className="font-size-command">
      <button
        type="button"
        onClick={() => onChange({ fontSize: Math.max(0, document.fontSize - 1) })}
      >
        -
      </button>
      <input
        type="text"
        onChange={(event) => onChange({ fontSize: parseInt(event.currentTarget.value) || 0 })}
        value={document.fontSize}
        style={{ width: "25px" }}
      />
      <button
        type="button"
        onClick={() => onChange({ fontSize: Math.max(0, document.fontSize + 1) })}
      >
        +
      </button>
    </div>
  );
}
