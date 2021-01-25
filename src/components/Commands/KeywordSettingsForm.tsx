import { Component, ReactNode } from "react";
import { KeywordSettings } from "../../models/Settings";
import React from "react";
import { cloneDeep } from "lodash";
import { IKeywordSettingsFormProps } from "./IKeywordSettingsFormProps";
import { KeywordSettingsFormState } from "./KeywordSettingsFormState";


export class KeywordSettingsForm extends Component<
  IKeywordSettingsFormProps,
  KeywordSettingsFormState
  > {
  constructor(props: IKeywordSettingsFormProps) {
    super(props);
    this.state = new KeywordSettingsFormState();
  }

  componentDidMount(): void {
    this.updateState({ selected: cloneDeep(this.props.item) });
  }

  updateState<k extends keyof KeywordSettingsFormState>(
    change: Pick<KeywordSettingsFormState, k>
  ): Promise<void> {
    return new Promise((resolve) => this.setState(change, resolve));
  }

  updateSelected(change: Partial<KeywordSettings>): Promise<void> {
    const selected = { ...this.state.selected, ...change };
    return this.updateState({ selected });
  }

  render(): ReactNode {
    const { selected } = this.state;
    return (
      <div className="keyword-settings-form">
        <div className="field">
          <div className="control">
            <label className="checkbox">
              <input
                // checked={selected.isPinned}
                onChange={({ target }) => this.updateSelected({ isPinned: target.checked })}
                type="checkbox" />
              <span>&nbsp;Pinned</span>
            </label>
          </div>
        </div>
        <div className="field">
          <label className="label">Text</label>
          <div className="control">
            <input
              value={selected.text}
              onChange={({ target }) => this.updateSelected({ text: target.value })}
              type="text"
              className="input" />
          </div>
        </div>
        <div className="field">
          <label className="label">Color</label>
          <div className="control">
            <input
              value={selected.color}
              onChange={({ target }) => this.updateSelected({ color: target.value })}
              type="color"
              className="input" />
          </div>
        </div>

        <div className="buttons">
          <button
            onClick={() => this.props.onSave(selected)}
            type="button"
            className="button is-success"
          >
            Save
          </button>
          <button onClick={() => this.props.onCancel()} type="button" className="button">
            Cancel
          </button>
        </div>
      </div>
    );
  }
}
