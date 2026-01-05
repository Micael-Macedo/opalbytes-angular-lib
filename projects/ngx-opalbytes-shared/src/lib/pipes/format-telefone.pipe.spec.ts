import { FormatTelefonePipe } from "./format-telefone.pipe";

describe("FormatTelefonePipe", () => {
  let pipe: FormatTelefonePipe;

  beforeEach(() => {
    pipe = new FormatTelefonePipe();
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

  it("should correctly format a partial phone number", () => {
    expect(pipe.transform("12")).toBe("(12)");
    expect(pipe.transform("123456")).toBe("(12) 3456");
  });

  it("should correctly format a 10-digit phone number (landline)", () => {
    expect(pipe.transform("1234567890")).toBe("(12) 3456-7890");
  });

  it("should correctly format an 11-digit phone number (mobile)", () => {
    expect(pipe.transform("12345678901")).toBe("(12) 34567-8901");
  });

  it("should remove non-numeric characters", () => {
    expect(pipe.transform("(12) 3456-7890a")).toBe("(12) 3456-7890");
    expect(pipe.transform("(12) 34567-8901b")).toBe("(12) 34567-8901");
  });

  it("should handle phone numbers with more than 11 digits by truncating", () => {
    expect(pipe.transform("123456789012")).toBe("(12) 34567-8901");
  });
});
