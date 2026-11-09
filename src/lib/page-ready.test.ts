// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { waitForEvent } from "./page-ready";

describe("connection-dependent readiness", () => {
  it("waits for actual loading completion instead of elapsed time", async () => {
    const target = new EventTarget();
    let ready = false;
    const pending = waitForEvent(target, ["load"], false, new AbortController().signal).then(() => {
      ready = true;
    });
    await Promise.resolve();
    expect(ready).toBe(false);
    target.dispatchEvent(new Event("load"));
    await pending;
    expect(ready).toBe(true);
  });

  it("does not delay resources that are already cached", async () => {
    let ready = false;
    await waitForEvent(new EventTarget(), ["load"], true, new AbortController().signal).then(() => {
      ready = true;
    });
    expect(ready).toBe(true);
  });

  it("allows failed resources to settle without trapping visitors", async () => {
    const target = new EventTarget();
    let ready = false;
    const pending = waitForEvent(
      target,
      ["load", "error"],
      false,
      new AbortController().signal,
    ).then(() => {
      ready = true;
    });
    expect(ready).toBe(false);
    target.dispatchEvent(new Event("error"));
    await pending;
    expect(ready).toBe(true);
  });
});
