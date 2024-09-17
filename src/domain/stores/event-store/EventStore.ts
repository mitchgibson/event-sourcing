import { Event, EventLike } from "../../events/Event";
import { EventIterator } from "../../events/EventIterator";

type Store = Record<string, Record<string, EventLike[]>>;

export type EventStore = ReturnType<typeof useEventStore>;

export function useEventStore() {
  const store: Store = {};
  loadFromLocalStorage();

  async function create(event: Event): Promise<void> {
    console.log("Event stored", event);
    const scope = event.type;
    const topic = event.aggregateId;

    store[scope] = store[scope] || {};
    store[scope][topic] = store[scope][topic] || [];

    const events = store[scope][topic];
    const last = events[events.length - 1];

    event.sequence = last ? last.sequence + 1 : 1;
    events.push(event.toRaw());
    store[scope][topic] = events;

    storeInLocalStorage();

      // console.log(`Event ${event.id} created for aggregate ${event.aggregateId}`);
      // console.log(events);
  }

  async function findAll(scope: string, aggregateId: string): Promise<EventIterator> {
    const events = store[scope]?.[aggregateId] || [];
    return new EventIterator(events);
  }

  async function findLast(scope:string, aggregateId: string): Promise<Event> {
    const events = store[scope]?.[aggregateId] || [];
    const last = events[events.length - 1];
    if (!last) throw new Error(`No events found for aggregate ${aggregateId}`);
    return new Event(last);
  }

  function storeInLocalStorage() {
    localStorage.setItem("events", JSON.stringify(store));
  }

  function loadFromLocalStorage() {
    const events = localStorage.getItem("events");
    if (events) {
      const entries = JSON.parse(events) || {};
      for (const key in entries) {
        store[key] = entries[key];
      }
    }
  }

  return {
    create,
    findAll,
    findLast,
  };
}
