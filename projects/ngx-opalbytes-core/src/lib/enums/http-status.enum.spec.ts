import { describe, it, expect } from "vitest";

import { HttpStatus, HttpStatusCategory, HttpStatusUtil } from "./http-status.enum";

describe("HttpStatus", () => {
  it("should define the expected status codes", () => {
    expect(HttpStatus.OK).toBe(200);
    expect(HttpStatus.CREATED).toBe(201);
    expect(HttpStatus.NO_CONTENT).toBe(204);
    expect(HttpStatus.BAD_REQUEST).toBe(400);
    expect(HttpStatus.UNAUTHORIZED).toBe(401);
    expect(HttpStatus.FORBIDDEN).toBe(403);
    expect(HttpStatus.NOT_FOUND).toBe(404);
    expect(HttpStatus.INTERNAL_SERVER_ERROR).toBe(500);
    expect(HttpStatus.SERVICE_UNAVAILABLE).toBe(503);
  });
});

describe("HttpStatusUtil", () => {
  describe("getCategory", () => {
    it("should return SUCCESS for 2xx statuses", () => {
      expect(HttpStatusUtil.getCategory(200)).toBe(HttpStatusCategory.SUCCESS);
      expect(HttpStatusUtil.getCategory(204)).toBe(HttpStatusCategory.SUCCESS);
    });

    it("should return REDIRECTION for 3xx statuses", () => {
      expect(HttpStatusUtil.getCategory(301)).toBe(HttpStatusCategory.REDIRECTION);
      expect(HttpStatusUtil.getCategory(304)).toBe(HttpStatusCategory.REDIRECTION);
    });

    it("should return CLIENT_ERROR for 4xx statuses", () => {
      expect(HttpStatusUtil.getCategory(400)).toBe(HttpStatusCategory.CLIENT_ERROR);
      expect(HttpStatusUtil.getCategory(404)).toBe(HttpStatusCategory.CLIENT_ERROR);
    });

    it("should return SERVER_ERROR for 5xx statuses", () => {
      expect(HttpStatusUtil.getCategory(500)).toBe(HttpStatusCategory.SERVER_ERROR);
      expect(HttpStatusUtil.getCategory(503)).toBe(HttpStatusCategory.SERVER_ERROR);
    });

    it("should return UNKNOWN for other statuses", () => {
      expect(HttpStatusUtil.getCategory(100)).toBe(HttpStatusCategory.UNKNOWN);
      expect(HttpStatusUtil.getCategory(999)).toBe(HttpStatusCategory.UNKNOWN);
    });
  });

  describe("isClientError", () => {
    it("should return true for 4xx", () => {
      expect(HttpStatusUtil.isClientError(404)).toBe(true);
    });

    it("should return false for non-4xx", () => {
      expect(HttpStatusUtil.isClientError(500)).toBe(false);
    });
  });

  describe("isServerError", () => {
    it("should return true for 5xx", () => {
      expect(HttpStatusUtil.isServerError(500)).toBe(true);
    });

    it("should return false for non-5xx", () => {
      expect(HttpStatusUtil.isServerError(404)).toBe(false);
    });
  });

  describe("isSuccess", () => {
    it("should return true for 2xx", () => {
      expect(HttpStatusUtil.isSuccess(200)).toBe(true);
    });

    it("should return false for non-2xx", () => {
      expect(HttpStatusUtil.isSuccess(400)).toBe(false);
    });
  });

  describe("shouldRedirect", () => {
    it("should return true for 401 and 403", () => {
      expect(HttpStatusUtil.shouldRedirect(401)).toBe(true);
      expect(HttpStatusUtil.shouldRedirect(403)).toBe(true);
    });

    it("should return false for other statuses", () => {
      expect(HttpStatusUtil.shouldRedirect(500)).toBe(false);
      expect(HttpStatusUtil.shouldRedirect(200)).toBe(false);
    });
  });
});