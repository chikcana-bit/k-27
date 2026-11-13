import { describe, it, expect } from "vitest";
import { openState, parseDaily } from "../src/content/hours";

describe("open-now helper", () => {
  const d = parseDaily("Ежедневно, 10:00–19:00")!;
  it("parses a daily schedule", () => expect(d).toEqual({ open: 600, close: 1140 }));
  it("ignores anything it cannot parse", () => {
    expect(parseDaily(null)).toBeNull();
    expect(parseDaily("Пн–Пт, 09:00–19:00")).toBeNull();
  });
  // Khabarovsk = UTC+10 (Asia/Vladivostok zone).
  it("open at 12:00 local → open until 19:00", () => expect(openState(d, "Asia/Vladivostok", new Date("2026-11-12T02:00:00Z"))).toEqual({ open: true, next: "19:00" }));
  it("closed at 19:00 local → closed until 10:00", () => expect(openState(d, "Asia/Vladivostok", new Date("2026-11-12T09:00:00Z"))).toEqual({ open: false, next: "10:00" }));
  it("closed at 08:30 local", () => expect(openState(d, "Asia/Vladivostok", new Date("2026-11-11T22:30:00Z")).open).toBe(false));
});
