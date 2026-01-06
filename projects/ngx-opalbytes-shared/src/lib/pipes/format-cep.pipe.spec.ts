import { FormatCepPipe } from "./format-cep.pipe";

describe("FormatCepPipe", () => {
  let pipe: FormatCepPipe;

  beforeEach(() => {
    pipe = new FormatCepPipe();
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

  it("should correctly format a partial CEP", () => {
    expect(pipe.transform("12")).toBe("12");
    expect(pipe.transform("12345")).toBe("12.345");
  });

  it("should correctly format a complete CEP", () => {
    expect(pipe.transform("12345678")).toBe("12.345-678");
  });

  it("should remove non-numeric characters", () => {
    expect(pipe.transform("12a34-567b8")).toBe("12.345-678");
  });

  it("should handle CEPs with more than 8 digits by truncating", () => {
    expect(pipe.transform("1234567890")).toBe("12.345-678");
  });
});
