import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CaoConfigService } from "./config.service";
import { APP_CONFIG, ICaoAppConfig } from "../../config/app-config";
import { ApiPath, ApiUrl, HttpMethod } from "../../config/app-endpoints";
import { EnvironmentEnum } from "../../enums";

const testConfig: ICaoAppConfig = {
  production: false,
  environment: EnvironmentEnum.local,
  urls: {
    [ApiUrl.API]: "https://api.example.com/",
    [ApiUrl.CROPPING]: "https://crop.example.com",
  },
  paths: {
    [ApiPath.BOX]: "box",
    [ApiPath.PERSON]: "/people",
  },
  httpMethods: {
    [HttpMethod.GET]: "GET",
  },
};

describe("CaoConfigService", () => {
  let service: CaoConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: APP_CONFIG, useValue: testConfig }],
    });
    service = TestBed.inject(CaoConfigService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return the full config", () => {
    expect(service.getConfig()).toEqual(testConfig);
  });

  it("should return the API URL", () => {
    expect(service.getApiUrl()).toBe("https://api.example.com");
  });

  it("should normalize trailing slash on getUrl", () => {
    expect(service.getUrl(ApiUrl.API)).toBe("https://api.example.com");
    expect(service.getUrl(ApiUrl.CROPPING)).toBe("https://crop.example.com");
  });

  it("should return empty string for unknown url", () => {
    expect(service.getUrl("NOPE")).toBe("");
  });

  it("should normalize paths with leading slash", () => {
    expect(service.getPath(ApiPath.BOX)).toBe("/box");
    expect(service.getPath(ApiPath.PERSON)).toBe("/people");
  });

  it("should return empty string for unknown path", () => {
    expect(service.getPath("NOPE")).toBe("");
  });

  it("should build a full URL from path and base url", () => {
    expect(service.buildUrl(ApiPath.BOX)).toBe("https://api.example.com/box");
  });

  it("should build a URL using an alternative base url", () => {
    expect(service.buildUrl(ApiPath.PERSON, ApiUrl.CROPPING)).toBe("https://crop.example.com/people");
  });

  it("should replace params in buildUrlWithParams", () => {
    expect(service.buildUrlWithParams(ApiPath.BOX, {})).toBe("https://api.example.com/box");
  });

  it("should return correct http method", () => {
    expect(service.getHttpMethod(HttpMethod.GET)).toBe("GET");
  });

  it("should report production status", () => {
    expect(service.isProduction()).toBe(false);
  });

  it("should return the environment name", () => {
    expect(service.getEnvironment()).toBe(EnvironmentEnum.local);
  });
});