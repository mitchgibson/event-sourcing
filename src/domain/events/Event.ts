export type EventLike<T = any> = {
  type: string;
  id: string;
  aggregateId: string;
  version: string;
  sequence: number;
  metadata: Record<string, any>;
  occurredAt: string;
  data: T;
};

export type EventData<T = any> = { type: string; aggregateId: string } & Partial<EventLike<T>>;

export class Event<T = any> implements EventLike<T> {
  type: string;
  id: string;
  aggregateId: string;
  version: string;
  sequence: number;
  metadata: Record<string, any>;
  occurredAt: string;
  data: T;

  constructor(data: EventData<T>) {
    console.log("Event object instantiated", data);

    this.type = data.type;
    this.id = data.id || "";
    this.aggregateId = data.aggregateId || "";
    this.version = data.version || "1.0.0";
    this.sequence = data.sequence || 1;
    this.metadata = data.metadata || {};
    this.occurredAt = data.occurredAt || new Date().toISOString();
    this.data = data.data as T;
  }

  toRaw(): EventLike<T> {
    return {
      type: this.type,
      id: this.id,
      aggregateId: this.aggregateId,
      version: this.version,
      sequence: this.sequence,
      metadata: this.metadata,
      occurredAt: this.occurredAt,
      data: this.data,
    };
  }
}
