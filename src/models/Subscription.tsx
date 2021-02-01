import { ISubscriber } from "./ISubscriber";

export interface IContext<T> {
  from: T;
  to: T;
}
export interface ISubscription {
  unsubscribe(): void;
}
export interface ISubject<T>{
  notifyAll(context:T):void;
  subscribe(subscriber: ISubscriber<T>):ISubscription
}

export class Subscription<T> {
  private subscribers: ISubscriber<T>[] = [];
  notifyAll(context: T): void {
    this.subscribers.forEach((item) => item.next(context));
  }

  subscribe(subscriber: ISubscriber<T>): ISubscription {
    const length = this.subscribers.length;
    this.subscribers.push(subscriber);
    return {
      unsubscribe: () => {
        this.subscribers.splice(length, 1);
      },
    };
  }
}
