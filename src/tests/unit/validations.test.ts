import { describe, it, expect } from "vitest";
import {
  signUpSchema,
  signInSchema,
  createBoardSchema,
  addMetricSchema,
} from "@/lib/validations";

describe("signUpSchema", () => {
  it("accepts valid input", () => {
    const result = signUpSchema.safeParse({
      name: "Jane Smith",
      email: "jane@example.com",
      password: "securepass123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = signUpSchema.safeParse({
      name: "J",
      email: "j@example.com",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = signUpSchema.safeParse({
      name: "Jane",
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = signUpSchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });
});

describe("signInSchema", () => {
  it("accepts valid credentials", () => {
    const result = signInSchema.safeParse({
      email: "user@example.com",
      password: "anypassword",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty password", () => {
    const result = signInSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("createBoardSchema", () => {
  it("accepts minimal valid input", () => {
    const result = createBoardSchema.safeParse({ name: "My Board" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.isPublic).toBe(false);
  });

  it("rejects empty name", () => {
    const result = createBoardSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("accepts isPublic: true", () => {
    const result = createBoardSchema.safeParse({ name: "Board", isPublic: true });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.isPublic).toBe(true);
  });
});

describe("addMetricSchema", () => {
  it("accepts valid metric", () => {
    const result = addMetricSchema.safeParse({
      boardId: "clxxxxxxxxxxxxxxxxxxxxxx",
      name: "Revenue",
      value: 9999.99,
      unit: "USD",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-number value", () => {
    const result = addMetricSchema.safeParse({
      boardId: "clxxxxxxxxxxxxxxxxxxxxxx",
      name: "Revenue",
      value: "not-a-number",
    });
    expect(result.success).toBe(false);
  });

  it("defaults timestamp to undefined (coerced in action)", () => {
    const result = addMetricSchema.safeParse({
      boardId: "clxxxxxxxxxxxxxxxxxxxxxx",
      name: "Test",
      value: 1,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.timestamp).toBeUndefined();
  });
});
