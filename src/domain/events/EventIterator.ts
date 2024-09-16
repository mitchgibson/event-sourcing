import { Event, EventLike } from "./Event";

export class EventIterator<T = any> {
  private index: number = -1;
  
  constructor(private readonly events: EventLike<T>[]) {}

  move(index: number): Event<T> | undefined {
    this.index = index;
    return this.current();
  }

  next(): Event<T> | undefined {
    this.index++;
    return this.current();
  }

  done(): boolean {
    return this.index >= this.events.length ? true : false;
  }

  current(): Event<T> | undefined {
    if (this.index < 0 || this.index >= this.events.length) {
      return undefined;
    }
    const event = this.events[this.index];
    return new Event(event);
  }
}
