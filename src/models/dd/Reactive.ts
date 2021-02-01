import { IService } from "../../services/IService";
import { IContext, Subscription } from "../Subscription";

export interface IReactive {
    dude: string
}

export class Reactive1 implements IReactive {
    dude = ""
}


export class ReactiveDecorator1 implements IReactive {
    subscription = new Subscription<IContext<IReactive>>();

    get dude(): string {
        return this.concrete.dude;
    }
    set dude(val: string) {
        if (val !== this.dude) {
            this.concrete.dude = val;
            this.subscription.notifyAll({ from: this, to: this })
        }
    }
    constructor(private concrete: IReactive) {

    }


}

export class SaveToLocalStorage extends ReactiveDecorator1 {

    constructor(concrete: IReactive, service: IService<IReactive>) {
        super(concrete);
        this.subscription.subscribe({
            next: context => service.save(context.to)
        })
    }

}

export interface IDictionary{
    [key:string]: unknown
}

export class ReactiveDecorator {


    constructor(o: IDictionary) {
        Object.keys(this).forEach(key => {
            // delete this[key];
            Object.defineProperty(this, key, {
                get: () => o[key]
                , set: val => o[key] = val
            })
        });
    }

}
