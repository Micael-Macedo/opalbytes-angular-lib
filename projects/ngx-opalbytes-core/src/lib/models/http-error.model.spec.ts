import { describe, it, expect } from "vitest";

import { HttpErrorModel } from "./http-error.model";
import { ICaoHttpErrorConfig } from "./http-error.model";
import { HttpStatusCategory } from "../enums/http-status.enum";

describe("HttpErrorModel", () => {
  const config: ICaoHttpErrorConfig = {
    status: 404,
    title: "Não Encontrado",
    message: "O recurso não foi encontrado.",
    category: HttpStatusCategory.CLIENT_ERROR,
    shouldShowAlert: true,
    shouldRedirect: false,
    redirectPath: undefined,
  };

  it("should create an instance with the provided values", () => {
    const error = new HttpErrorModel(
      config.status,
      config.title,
      config.message,
      config.category,
      config.shouldShowAlert,
      config.shouldRedirect,
      config.redirectPath
    );

    expect(error.status).toBe(404);
    expect(error.title).toBe("Não Encontrado");
    expect(error.message).toBe("O recurso não foi encontrado.");
    expect(error.category).toBe(HttpStatusCategory.CLIENT_ERROR);
    expect(error.shouldShowAlert).toBe(true);
    expect(error.shouldRedirect).toBe(false);
  });

  it("should apply default values when not provided", () => {
    const error = new HttpErrorModel(500, "Erro", "Falha", HttpStatusCategory.SERVER_ERROR);
    expect(error.shouldShowAlert).toBe(true);
    expect(error.shouldRedirect).toBe(false);
    expect(error.redirectPath).toBeUndefined();
  });

  it("should create from config via fromConfig", () => {
    const originalError = { message: "boom" };
    const error = HttpErrorModel.fromConfig(config, originalError);

    expect(error.status).toBe(config.status);
    expect(error.title).toBe(config.title);
    expect(error.message).toBe(config.message);
    expect(error.category).toBe(config.category);
    expect(error.originalError).toBe(originalError);
  });

  it("should identify client errors", () => {
    const error = new HttpErrorModel(400, "Bad Request", "x", HttpStatusCategory.CLIENT_ERROR);
    expect(error.isClientError()).toBe(true);
    expect(error.isServerError()).toBe(false);
  });

  it("should identify server errors", () => {
    const error = new HttpErrorModel(500, "Server Error", "x", HttpStatusCategory.SERVER_ERROR);
    expect(error.isServerError()).toBe(true);
    expect(error.isClientError()).toBe(false);
  });
});