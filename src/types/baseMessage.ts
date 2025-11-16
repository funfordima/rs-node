export interface BaseMessage<T> {
  type: string;
  data: T;
  id: number;
}

export abstract class AbstractMessage<T> implements BaseMessage<T> {
  abstract type: string;
  readonly id = 0;
  
  constructor(public data: T) {}
}
