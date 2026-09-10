import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

import { HelpConfig } from "./help-config";
import { CaoConfigService } from "../services/config/config.service";
import { APP_CONFIG, ICaoAppConfig } from "./app-config";
import { ApiPath, ApiUrl } from "./app-endpoints";
import { BASE_PATHS } from "../utils/app-config.base";
import { EnvironmentEnum } from "../enums";

const testConfig: ICaoAppConfig = {
  production: false,
  environment: EnvironmentEnum.local,
  urls: {
    [ApiUrl.API]: "https://api.example.com",
    [ApiUrl.IIPM_CROPPING]: "https://crop.example.com",
  },
  paths: BASE_PATHS,
  httpMethods: {},
};

describe("HelpConfig", () => {
  let service: HelpConfig;
  let configService: CaoConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_CONFIG, useValue: testConfig },
      ],
    });

    service = TestBed.inject(HelpConfig);
    configService = TestBed.inject(CaoConfigService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should expose BASE_API", () => {
    expect(service.BASE_API).toBe("https://api.example.com");
  });

  it("should build the person URL", () => {
    expect(service.getPersonUrl()).toBe("https://api.example.com/api/Person");
  });

  it("should build the cropping URL using IIPM_CROPPING base", () => {
    expect(service.getCroppingUrl()).toBe("https://crop.example.com/api/Cropping");
  });

  it("should return endpoint paths from config", () => {
    expect(service.PERSON_ENDPOINT).toBe(configService.getPath(ApiPath.PERSON));
    expect(service.RECORD_ENDPOINT).toBe(configService.getPath(ApiPath.RECORD));
    expect(service.BOX_ENDPOINT).toBe(configService.getPath(ApiPath.BOX));
  });
});