import { FormatRgPipe } from "./format-rg.pipe";

describe("FormatRgPipe", () => {
  let pipe: FormatRgPipe;

  beforeEach(() => {
    pipe = new FormatRgPipe();
  });

  it("should create an instance", () => {
    expect(pipe).toBeTruthy();
  });

  it("should return an empty string for null or undefined input", () => {
    expect(pipe.transform(null)).toBe("");
    expect(pipe.transform(undefined)).toBe("");
  });

  it("should return an empty string for an empty input", () => {
    expect(pipe.transform("")).toBe("");
  });

  it("should correctly format a partial RG", () => {
    expect(pipe.transform("12")).toBe("12");
    expect(pipe.transform("12345")).toBe("12.345");
    expect(pipe.transform("12345678")).toBe("12.345.678");
  });

  it("should correctly format a complete RG with 9 digits", () => {
    expect(pipe.transform("123456789")).toBe("12.345.678-9");
  });

  it("should correctly format a complete RG with 10 digits", () => {
    expect(pipe.transform("1234567890")).toBe("12.345.678-90");
  });

  it("should remove non-numeric characters", () => {
    expect(pipe.transform("12a345.678-9b")).toBe("12.345.678-9");
    expect(pipe.transform("12a345.678-90b")).toBe("12.345.678-90");
  });

  it("should handle RGs with more than 10 digits by truncating", () => {
    expect(pipe.transform("12345678901")).toBe("12.345.678-90");
  });
});
