import { FormatDataNascimentoPipe } from "./format-data-nascimento.pipe";

describe("FormatDataNascimentoPipe", () => {
  let pipe: FormatDataNascimentoPipe;

  beforeEach(() => {
    pipe = new FormatDataNascimentoPipe();
  });

  it("should create an instance", () => {
    expect(pipe).toBeTruthy();
  });

  it("should return an empty string for null or undefined input", () => {
    expect(pipe.transform(null)).toBe("");
    expect(pipe.transform(undefined)).toBe("");
  });

  it("should correctly format a Date object", () => {
    const date = new Date(2023, 10, 28); // Month is 0-indexed, so 10 is November
    expect(pipe.transform(date)).toBe("28/11/2023");
  });

  it('should correctly format a date string in "dd-mm-yyyy" format', () => {
    expect(pipe.transform("28-11-2023")).toBe("28/11/2023");
  });

  it('should correctly format a date string in "dd/mm/yyyy" format', () => {
    expect(pipe.transform("28/11/2023")).toBe("28/11/2023");
  });

  it("should correctly format a date string in ISO format", () => {
    expect(pipe.transform("2023-11-28T12:00:00Z")).toBe("28/11/2023");
  });

  it("should return an empty string for an invalid date string", () => {
    expect(pipe.transform("invalid-date")).toBe("");
  });
});
