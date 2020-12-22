import { ISubscriber } from "./ISubscriber";

export interface IContext<T>{
    from: T;
    to: T;
} 

export class Subscription<T> {
    private subscribers: ISubscriber<IContext<T>>[] =[];
    notifyAll(context : IContext<T>){
        this.subscribers.forEach(item => item.next(context));
    }

    subscribe(subscriber:ISubscriber<IContext<T>>){
        this.subscribers.push(subscriber);
    }
}

export interface ISubscription {
    notifyAll(context:any):void;
}

export class ConcreteSubscription implements ISubscription{

    constructor(){
        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                Object.defineProperty(this,key,{
                    get: ()=> this[key],
                    set:(val)=>{ 
                        this[key] = val;
                        this.notifyAll(this);
                    }
                });
            }
        }
    }

    subscriberList: ISubscriber<any>[] =[]

    notifyAll(context: any): void {
        this.subscriberList.forEach(item => item.next(context));
    }

}



