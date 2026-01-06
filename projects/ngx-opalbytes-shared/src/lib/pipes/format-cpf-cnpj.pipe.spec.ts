import { FormatCpfCnpjPipe } from "./format-cpf-cnpj.pipe";

describe("FormatCpfCnpjPipe", () => {
  let pipe: FormatCpfCnpjPipe;

  beforeEach(() => {
    pipe = new FormatCpfCnpjPipe();
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

  it("should correctly format a partial CPF", () => {
    expect(pipe.transform("123")).toBe("123");
    expect(pipe.transform("123456")).toBe("123.456");
    expect(pipe.transform("123456789")).toBe("123.456.789");
  });

  it("should correctly format a complete CPF", () => {
    expect(pipe.transform("12345678901")).toBe("123.456.789-01");
  });

  it("should correctly format a partial CNPJ", () => {
    expect(pipe.transform("123456789012")).toBe("12.345.678/9012");
  });

  it("should correctly format a complete CNPJ", () => {
    expect(pipe.transform("12345678901234")).toBe("12.345.678/9012-34");
  });

  it("should remove non-numeric characters", () => {
    expect(pipe.transform("12a345.678-90b1")).toBe("123.456.789-01");
    expect(pipe.transform("12a345.678/9012-34b")).toBe("12.345.678/9012-34");
  });

  it("should handle inputs with more than 14 digits by truncating", () => {
    expect(pipe.transform("123456789012345")).toBe("12.345.678/9012-34");
  });
});
