import { describe, it, expect } from "vitest";

import { BaseResourceModel } from "./base-resource.model";

describe("BaseResourceModel", () => {
  it("should create an instance", () => {
    expect(new BaseResourceModel()).toBeTruthy();
  });

  it("should accept an id string", () => {
    const model = new BaseResourceModel();
    model.id = "abc-123";
    expect(model.id).toBe("abc-123");
  });

  it("should accept an id number", () => {
    const model = new BaseResourceModel();
    model.id = 42;
    expect(model.id).toBe(42);
  });

  it("should allow arbitrary properties via index signature", () => {
    const model = new BaseResourceModel();
    model["name"] = "Opalbytes";
    expect(model["name"]).toBe("Opalbytes");
  });
});