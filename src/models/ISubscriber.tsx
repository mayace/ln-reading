export  interface ISubscriber<T>{
    next(context:T):void;
}
