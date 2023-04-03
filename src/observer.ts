import { randomUUID } from 'node:crypto';

type Subscription = (error?: Error | string, data?: string, done?: boolean) => void;

type Subscriber = {
  subscription: Subscription;
};

export type ObservableCallback = Subscription;
type SubscriberId = string;

export class StreamObservable {
  private readonly subscribers: Map<SubscriberId, Subscriber> = new Map();

  subscribe(callback: ObservableCallback): SubscriberId {
    if (typeof callback !== 'function') {
      throw new TypeError('Callback must be a function');
    }
    return this.createSubscriber(callback);
  }

  unsubscribe(id: SubscriberId): boolean {
    return this.subscribers.delete(id);
  }

  notify(error: any, data: any, options?: { done?: boolean }): void {
    const { done = false } = options || {};
    const id: SubscriberId = this.subscribers.keys().next().value;
    const subscriber = this.subscribers.get(id);
    subscriber?.subscription(error, data, done);
    if (done) {
      this.subscribers.delete(id);
    }
  }

  private createSubscriber(cb: Subscription): SubscriberId {
    const id = randomUUID();
    const s: Subscriber = {
      subscription: cb,
    };
    this.subscribers.set(id, s);
    return id;
  }
}
