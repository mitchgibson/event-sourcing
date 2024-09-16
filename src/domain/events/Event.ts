export type EventLike<T = any> = {
  id: string;
  aggregateId: string;
  version: string;
  sequence: number;
  metadata: Record<string, any>;
  occurredAt: string;
  data: T;
};

export class Event<T = any> implements EventLike<T> {
  id: string;
  aggregateId: string;
  version: string;
  sequence: number;
  metadata: Record<string, any>;
  occurredAt: string;
  data: T;

  constructor(data: Partial<EventLike<T>>) {
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
