export type Listener = (event: Event) => void;

export interface Event {
  type: string;
  // deno-lint-ignore no-explicit-any
  data?: any;
}

export class EventEmitter {
  private listeners: { [key: string]: Listener[] } = {};

  public on(eventType: string, listener: Listener) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(listener);
  }

  public emit(event: Event) {
    const { type, data } = event;
    if (this.listeners[type]) {
      this.listeners[type].forEach((listener) => listener(data));
    }
  }
}
