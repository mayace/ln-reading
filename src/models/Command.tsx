import { Component } from "react";
import { KeywordSettings } from "./LrSettings";

export interface ICommand {
    execute(params: any):void;
}

export class FuriganaVisibilityCommand implements ICommand{
    static CLASSNAME = "furigana-off";
    execute(params : any){
        document.body.classList.remove(FuriganaVisibilityCommand.CLASSNAME);
        if(params.visible){
            document.body.classList.add(FuriganaVisibilityCommand.CLASSNAME);
        }
    }
}

export abstract class CommandComponent extends Component{
    props: {command? : ICommand} = {}
    abstract render():JSX.Element;
}


export class FuriganaVisibilityComponent extends CommandComponent{
    state = {
        visible: true
    }
    
    get visible(){
        return this.state.visible;
    }
    
    render(): JSX.Element {
        return <div className="furigana-visibility-component">
        <label>
            <input onChange={({target}) => {
                this.setState({visible: target.checked});
                this.props.command?.execute({visible: this.visible});
            }} checked={this.visible} type="checkbox"/>
            <span>Furigana</span>
        </label>
    </div>;
    }
}

export class NotFoundComponent extends CommandComponent{
    render(): JSX.Element {
        return <div className="not-found-component">Not found.</div>
    }
}

export class KeywordsComponent extends Component{
    props : {
        keywordList: KeywordSettings[]
        onStateChanged?: (to: KeywordSettings[], from: KeywordSettings[])=>void
    } = { 
        keywordList: []
    }
    componentDidMount(){
        const { keywordList, onStateChanged} = this.props;
        if(keywordList.length === 0){
            onStateChanged && onStateChanged([new KeywordSettings()],keywordList);
        }
    }

    onChange(){

    }

    render(): JSX.Element {
        return <div className="keywords-component">
            <table>
                <tbody>
                    {this.props.keywordList.map((item, index) => {
                        return <tr key={index}>
                            <td>
                                <KeywordItem onChangeValue={ to => {
                                     const { keywordList, onStateChanged} = this.props;
                                     const newOne = [...keywordList];
                                     newOne[index] = to;
                                    onStateChanged && onStateChanged(newOne,keywordList);
                                }} keyword={item}/>
                                {index === this.props.keywordList.length - 1 && <button onClick={()=>{
                                    const { keywordList, onStateChanged} = this.props;
                                    const newOne = [...keywordList];
                                    newOne.push(new KeywordSettings());
                                   onStateChanged && onStateChanged(newOne,keywordList);
                                }} type="button">+</button>}
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    }
}

export  function KeywordItem ({ keyword, onChangeValue}: {keyword: KeywordSettings, onChangeValue?: (to:KeywordSettings)=>void}) {
    
    const onChange = (to:any) => onChangeValue && onChangeValue({...keyword,...to})

    return <div className="keyword-item">
        <input onChange={ event =>  onChange({color: event.target.value})} type="color" value={keyword.color}/>
        <input onChange={ event =>  onChange({text: event.target.value})} type="text" value={keyword.text} />
    </div>
}

export class CommandComponentFactory {
    createCommand(code:string) :JSX.Element{
        switch (code) {
            case "furigana-visibility":
                return  <FuriganaVisibilityComponent command={ new FuriganaVisibilityCommand()} />;
            case "keykwords":
                return <KeywordsComponent keywordList={[]}/>
        }
        return <NotFoundComponent/>
    }
}