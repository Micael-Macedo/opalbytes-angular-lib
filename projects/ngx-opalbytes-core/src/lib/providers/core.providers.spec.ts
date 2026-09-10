import { describe, it, expect } from "vitest";
import { EnvironmentProviders } from "@angular/core";

import { caoProvideCore, ICaoProvideConfig } from "./core.providers";
import { ICaoEnvironmentConfig } from "../interfaces/environment-config.interface";

const environment: ICaoEnvironmentConfig = {
  production: false,
  name: "local",
  buildDate: "2026-01-01",
};

describe("caoProvideCore", () => {
  it("should return EnvironmentProviders for a valid config", () => {
    const config: ICaoProvideConfig = {
      routes: [{ path: "", redirectTo: "/home", pathMatch: "full" }],
      environment,
    };

    const providers = caoProvideCore(config);
    expect(providers).toBeTruthy();
    expect(providers).toBeInstanceOf(Object);
  });

  it("should handle an empty routes array", () => {
    const config: ICaoProvideConfig = {
      routes: [],
      environment,
    };

    const providers = caoProvideCore(config);
    expect(providers).toBeTruthy();
  });

  it("should accept a production environment", () => {
    const prodEnv: ICaoEnvironmentConfig = {
      production: true,
      name: "production",
      buildDate: "2026-01-01",
    };

    const providers = caoProvideCore({ routes: [], environment: prodEnv });
    expect(providers).toBeTruthy();
  });
});