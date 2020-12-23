export interface IHandler{
    setNext(handler: IHandler):IHandler;
    handler(params: any):void;
}

export class BaseHandler  implements IHandler{
    private next? : IHandler;

    setNext(handler: IHandler): IHandler {
        this.next = handler;
        return handler;
    }

    handler(params: any): void {
       this.mainOperation(params);
       this.next?.handler(params);
    }

    mainOperation(params:any):void{
    }
}

export class FuriganaVisibility extends BaseHandler{

    static CLASSNAME = "furigana-off";

    mainOperation({ visibility } : any){
        document.body.classList.remove(FuriganaVisibility.CLASSNAME);
        if(visibility){
            document.body.classList.add(FuriganaVisibility.CLASSNAME);
        }
    }
}
