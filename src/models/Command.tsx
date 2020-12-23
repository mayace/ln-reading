import { Component } from "react";

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

export class CommandComponentFactory {
    createCommand(code:string) :JSX.Element{
        switch (code) {
            case "furigana-visibility":
                return  <FuriganaVisibilityComponent command={ new FuriganaVisibilityCommand()} />;
        }
        return <NotFoundComponent/>
    }
}