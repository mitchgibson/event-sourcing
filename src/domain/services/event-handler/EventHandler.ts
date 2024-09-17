import { Event, EventData } from "../../events/Event";
import { EventStore } from "../../stores/event-store/EventStore";
import { v4 as uuid } from "uuid";

const version = "1.0.0";

export type EventTypeHandler = (event: any) => void;

export class EventHandler {
  private handlers: Map<string, ((event: any) => void)[]> = new Map();
  
  constructor(private store: EventStore) {}
  
  register(scope: string, handler: (event: any) => void) {
    const handlers = this.handlers.get(scope) || [];
    handlers.push(handler);
    this.handlers.set(scope, handlers);
  }

  unregister(scope: string, handler: (event: any) => void) {
    const handlers = this.handlers.get(scope) || [];
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
    this.handlers.set(scope, handlers);
  }

  handle(event: any) {
    const scope = event.type;
    const handlers = this.handlers.get(scope) || [];
    handlers.forEach((handler) => handler(event));
  }

  event(event: EventData) {
    console.log("Event received by handler", event);
    const eventData = {
      id: uuid(),
      version,
      occurredAt: new Date().toISOString(),
      ...event,
    };

    this.store.create(new Event(eventData));
    this.handle(event);
  }
}