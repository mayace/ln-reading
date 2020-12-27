import { Component } from "react";
import { KeywordSettings } from "../../models/Settings";

export class KeywordsComponent extends Component {
  props: {
    keywordList: KeywordSettings[];
    onStateChanged?: (to: KeywordSettings[], from: KeywordSettings[]) => void;
  } = {
    keywordList: [],
  };
  componentDidUpdate() {
    const { keywordList, onStateChanged } = this.props;
    if (keywordList.length === 0) {
      onStateChanged && onStateChanged([new KeywordSettings()], keywordList);
    }
  }

  onChange() {}

  render(): JSX.Element {
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
                          newOne.push(new KeywordSettings());
                          onStateChanged && onStateChanged(newOne, keywordList);
                        }}
                        type="button"
                      >
                        +
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


export  function KeywordItem ({ keyword, onChangeValue}: {keyword: KeywordSettings, onChangeValue?: (to:KeywordSettings)=>void}) {
    const onChange = (to:any) => onChangeValue && onChangeValue({...keyword,...to})
    return <div className="keyword-item">
        <input onChange={ event =>  onChange({color: event.target.value})} type="color" value={keyword.color}/>
        <input onChange={ event =>  onChange({text: event.target.value})} type="text" value={keyword.text} />
    </div>
}