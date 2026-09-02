import { describe, test, expect, beforeEach } from "bun:test";
import { queueSwipe, getQueue, clearQueue, setQueue } from "../src/lib/offline";

describe("offline queue", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    globalThis.localStorage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
      key: (index: number) => Array.from(store.keys())[index] ?? null,
      get length() { return store.size; },
    } as Storage;
    clearQueue();
  });

  test("queueSwipe stores a swipe", () => {
    queueSwipe("card-1", "approve");
    const queue = getQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].cardId).toBe("card-1");
    expect(queue[0].direction).toBe("approve");
  });

  test("setQueue overwrites the queue", () => {
    queueSwipe("card-1", "approve");
    setQueue([{ cardId: "card-2", direction: "reject", createdAt: 1 }]);
    expect(getQueue().length).toBe(1);
    expect(getQueue()[0].cardId).toBe("card-2");
  });

  test("clearQueue empties the queue", () => {
    queueSwipe("card-1", "approve");
    clearQueue();
    expect(getQueue().length).toBe(0);
  });
});
