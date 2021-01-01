import { ISubscriber } from "./ISubscriber";

export interface IContext<T> {
  from: T;
  to: T;
}

export class Subscription<T> {
  private subscribers: ISubscriber<IContext<T>>[] = [];
  notifyAll(context: IContext<T>): void {
    this.subscribers.forEach((item) => item.next(context));
  }

  subscribe(subscriber: ISubscriber<IContext<T>>): void {
    this.subscribers.push(subscriber);
  }
}
