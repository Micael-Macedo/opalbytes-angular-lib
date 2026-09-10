import { describe, it, expect } from "vitest";

import { AlertMessageBuilder } from "./alert-message.builder";
import { HttpStatus } from "../enums/http-status.enum";
import { HttpStatusCategory } from "../enums/http-status.enum";

describe("AlertMessageBuilder", () => {
  describe("buildErrorConfig", () => {
    it("should build a config for a known status code", () => {
      const config = AlertMessageBuilder.buildErrorConfig(HttpStatus.NOT_FOUND);

      expect(config.status).toBe(404);
      expect(config.title).toBe("Não Encontrado");
      expect(config.category).toBe(HttpStatusCategory.CLIENT_ERROR);
      expect(config.shouldShowAlert).toBe(true);
      expect(config.shouldRedirect).toBe(false);
    });

    it("should use a custom message when provided", () => {
      const config = AlertMessageBuilder.buildErrorConfig(HttpStatus.NOT_FOUND, "Custom msg");
      expect(config.message).toBe("Custom msg");
    });

    it("should use default message when no custom message", () => {
      const config = AlertMessageBuilder.buildErrorConfig(HttpStatus.NOT_FOUND);
      expect(config.message).toBe("O recurso solicitado não foi encontrado.");
    });

    it("should build a config with redirect for 401", () => {
      const config = AlertMessageBuilder.buildErrorConfig(HttpStatus.UNAUTHORIZED);
      expect(config.shouldRedirect).toBe(true);
      expect(config.redirectPath).toBe("/login");
    });

    it("should fallback to default for unknown statuses", () => {
      const config = AlertMessageBuilder.buildErrorConfig(999);
      expect(config.title).toBe("Erro Inesperado");
      expect(config.category).toBe(HttpStatusCategory.UNKNOWN);
    });
  });

  describe("buildSuccessConfig", () => {
    it("should build a success config", () => {
      const config = AlertMessageBuilder.buildSuccessConfig();

      expect(config.status).toBe(HttpStatus.OK);
      expect(config.title).toBe("Sucesso");
      expect(config.message).toBe("Operação realizada com sucesso.");
      expect(config.category).toBe(HttpStatusCategory.SUCCESS);
      expect(config.shouldShowAlert).toBe(true);
      expect(config.shouldRedirect).toBe(false);
    });

    it("should use a custom message when provided", () => {
      const config = AlertMessageBuilder.buildSuccessConfig("Tudo certo!");
      expect(config.message).toBe("Tudo certo!");
    });
  });

  describe("extractMessageFromResponse", () => {
    it("should return null for falsy values", () => {
      expect(AlertMessageBuilder.extractMessageFromResponse(null)).toBeNull();
      expect(AlertMessageBuilder.extractMessageFromResponse(undefined)).toBeNull();
    });

    it("should return the string directly for string input", () => {
      expect(AlertMessageBuilder.extractMessageFromResponse("erro direto")).toBe("erro direto");
    });

    it("should return null for empty string", () => {
      expect(AlertMessageBuilder.extractMessageFromResponse("   ")).toBeNull();
    });

    it("should extract from messages array first", () => {
      const data = { messages: ["primeira", "segunda"], message: "mensagem" };
      expect(AlertMessageBuilder.extractMessageFromResponse(data)).toBe("primeira, segunda");
    });

    it("should extract from message string", () => {
      const data = { message: "mensagem de erro" };
      expect(AlertMessageBuilder.extractMessageFromResponse(data)).toBe("mensagem de erro");
    });

    it("should extract from detail", () => {
      const data = { detail: "detalhe do erro" };
      expect(AlertMessageBuilder.extractMessageFromResponse(data)).toBe("detalhe do erro");
    });

    it("should extract from error", () => {
      const data = { error: "erro genérico" };
      expect(AlertMessageBuilder.extractMessageFromResponse(data)).toBe("erro genérico");
    });

    it("should return null when nothing matches", () => {
      const data = { foo: "bar" };
      expect(AlertMessageBuilder.extractMessageFromResponse(data)).toBeNull();
    });

    it("should filter non-string messages from array", () => {
      const data = { messages: [{ code: 1 }, "texto valido"] };
      expect(AlertMessageBuilder.extractMessageFromResponse(data)).toBe("texto valido");
    });
  });
});