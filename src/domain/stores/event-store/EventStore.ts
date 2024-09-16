import { Event, EventLike } from "../../events/Event";
import { EventIterator } from "../../events/EventIterator";
import { v4 as uuid } from "uuid";

export function useEventStore() {
  const store = new Map<string, EventLike<any>[]>();
  const version = "1.0.0";
  loadFromLocalStorage();

  async function create(partialEvent: Pick<EventLike<any>, "aggregateId" | "data">): Promise<void> {
    const eventData = {
      id: uuid(),
      version,
      occurredAt: new Date().toISOString(),
      ...partialEvent,
    };

    const event = new Event(eventData);

    const topic = event.aggregateId;
    const events = store.get(topic) || [];
    const last = events[events.length - 1];
    event.sequence = last ? last.sequence + 1 : 1;
    events.push(event.toRaw());
    store.set(topic, events);
    storeInLocalStorage();

    console.log(`Event ${event.id} created for aggregate ${event.aggregateId}`);
    console.log(events);
  }

  async function findAll(aggregateId: string): Promise<EventIterator> {
    const events = store.get(aggregateId) || [];
    return new EventIterator(events);
  }

  async function findLast(aggregateId: string): Promise<Event> {
    const events = store.get(aggregateId) || [];
    return new Event(events[events.length - 1]);
  }

  function storeInLocalStorage() {
    localStorage.setItem("events", JSON.stringify(Array.from(store.entries())));
  }

  function loadFromLocalStorage() {
    const events = localStorage.getItem("events");
    if (events) {
      const entries = JSON.parse(events);
      for (const [key, value] of entries) {
        store.set(key, value);
      }
    }
  }

  return {
    create,
    findAll,
    findLast,
  };
}
