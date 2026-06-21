import { describe, it, expect } from "vitest";
import { parseCsvText } from "@/lib/csv";

describe("parseCsvText", () => {
  it("parses valid CSV with required columns", () => {
    const csv = `name,value\nDAU,1500\nRevenue,9800`;
    const { rows, errors } = parseCsvText(csv);
    expect(errors).toHaveLength(0);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ name: "DAU", value: 1500 });
    expect(rows[1]).toMatchObject({ name: "Revenue", value: 9800 });
  });

  it("parses optional unit and timestamp columns", () => {
    const csv = `name,value,unit,timestamp\nCPU,45,%,2024-01-15`;
    const { rows, errors } = parseCsvText(csv);
    expect(errors).toHaveLength(0);
    expect(rows[0].unit).toBe("%");
    expect(rows[0].timestamp).toBeInstanceOf(Date);
  });

  it("trims and lowercases header names", () => {
    const csv = `  Name  ,  Value  \nTest,42`;
    const { rows, errors } = parseCsvText(csv);
    expect(errors).toHaveLength(0);
    expect(rows[0]).toMatchObject({ name: "Test", value: 42 });
  });

  it("returns errors for missing name column", () => {
    const csv = `value\n100`;
    const { rows, errors } = parseCsvText(csv);
    expect(rows).toHaveLength(0);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("returns errors for non-numeric value", () => {
    const csv = `name,value\nTest,notanumber`;
    const { rows, errors } = parseCsvText(csv);
    expect(rows).toHaveLength(0);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("rejects empty CSV", () => {
    const { rows, errors } = parseCsvText("name,value");
    expect(rows).toHaveLength(0);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("handles up to 500 rows", () => {
    const header = "name,value\n";
    const rows = Array.from({ length: 500 }, (_, i) => `metric${i},${i}`).join("\n");
    const result = parseCsvText(header + rows);
    expect(result.errors).toHaveLength(0);
    expect(result.rows).toHaveLength(500);
  });

  it("rejects more than 500 rows", () => {
    const header = "name,value\n";
    const rows = Array.from({ length: 501 }, (_, i) => `metric${i},${i}`).join("\n");
    const result = parseCsvText(header + rows);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
