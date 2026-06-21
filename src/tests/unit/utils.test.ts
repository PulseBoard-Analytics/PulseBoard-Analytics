import { describe, it, expect } from "vitest";
import { formatNumber, formatDate, cn } from "@/lib/utils";

describe("formatNumber", () => {
  it("formats integers as-is", () => {
    expect(formatNumber(42)).toBe("42");
  });

  it("formats decimals to 2dp", () => {
    expect(formatNumber(3.14159)).toBe("3.14");
  });

  it("formats thousands with k suffix", () => {
    expect(formatNumber(1500)).toBe("1.5k");
  });

  it("formats millions with M suffix", () => {
    expect(formatNumber(2_500_000)).toBe("2.5M");
  });

  it("handles negative numbers", () => {
    expect(formatNumber(-1500)).toBe("-1.5k");
  });
});

describe("formatDate", () => {
  it("formats a date string", () => {
    const result = formatDate("2024-06-15");
    expect(result).toMatch(/Jun/);
    expect(result).toMatch(/2024/);
  });

  it("formats a Date object", () => {
    // Use a date that's unambiguously in January regardless of timezone
    const result = formatDate(new Date("2024-01-15T12:00:00"));
    expect(result).toMatch(/Jan/);
  });
});

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "nope", "yes")).toBe("base yes");
  });

  it("deduplicates Tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
