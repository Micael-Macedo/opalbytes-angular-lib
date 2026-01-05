import { FormatDatePipe } from "./format-date.pipe";

describe("FormatDatePipe", () => {
  let pipe: FormatDatePipe;

  beforeEach(() => {
    pipe = new FormatDatePipe();
  });

  it("should create an instance", () => {
    expect(pipe).toBeTruthy();
  });

  it("should return an empty string for null or undefined input", () => {
    expect(pipe.transform(null)).toBe("");
    expect(pipe.transform(undefined)).toBe("");
  });

  it('should format a Date object to DD/MM/YYYY by default', () => {
    const date = new Date(2023, 10, 28);
    expect(pipe.transform(date)).toBe('28/11/2023');
  });

  it('should format a date string to DD/MM/YYYY by default', () => {
    const date = '2023-11-28T10:00:00.000Z';
    expect(pipe.transform(date)).toBe('28/11/2023');
  });

  it('should format a Date object to YYYY-MM-DD', () => {
    const date = new Date(2023, 10, 28);
    expect(pipe.transform(date, 'YYYY-MM-DD')).toBe('2023-11-28');
  });

  it('should format a date string to YYYY-MM-DD', () => {
    const date = '2023-11-28T10:00:00.000Z';
    expect(pipe.transform(date, 'YYYY-MM-DD')).toBe('2023-11-28');
  });

  it("should return an empty string for an invalid date", () => {
    expect(pipe.transform("invalid date")).toBe("");
  });
});
