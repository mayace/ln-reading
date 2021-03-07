export interface ILinkedComposite<T> {
  append(node: T): T;
  getNext(): T | undefined;
}

