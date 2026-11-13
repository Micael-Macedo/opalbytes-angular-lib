import { PLATFORM_ID } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { jwtDecode } from "jwt-decode";
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";

import { CaoVariables } from "../../enums/variaveis.enum";
import { CaoLocalStorageService } from "../storage";
import { StorageService } from "../storage/storage.service";
import { CaoTokenService } from "./token.service";

vi.mock("jwt-decode", () => ({ jwtDecode: vi.fn() }));

const LEGACY_PREFIX = "app_";
const NOW_MS = 1_700_000_000_000;
const NOW_S = Math.floor(NOW_MS / 1000);

describe("CaoTokenService", () => {
  let service: CaoTokenService;

  const storageMock = {
    getItem: vi.fn(),
  };

  const localStorageMock = {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    has: vi.fn(),
  };

  const jwtDecodeMock = jwtDecode as unknown as Mock;

  function setup(platformId: string = "browser"): CaoTokenService {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageMock },
        { provide: CaoLocalStorageService, useValue: localStorageMock },
        { provide: PLATFORM_ID, useValue: platformId },
      ],
    });
    return TestBed.inject(CaoTokenService);
  }

  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    localStorage.clear();
    storageMock.getItem.mockReturnValue(null);
    localStorageMock.has.mockReturnValue(false);
    localStorageMock.get.mockReturnValue(null);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    service = setup();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("getToken / hasToken", () => {
    it("should return token when present", () => {
      storageMock.getItem.mockReturnValue("token-123");

      expect(service.getToken()).toBe("token-123");
      expect(storageMock.getItem).toHaveBeenCalledWith(CaoVariables.STORAGE_AUTH);
    });

    it("should return null when there is no token", () => {
      storageMock.getItem.mockReturnValue(null);

      expect(service.getToken()).toBeNull();
    });

    it("should return null for an empty string token", () => {
      storageMock.getItem.mockReturnValue("");

      expect(service.getToken()).toBeNull();
    });

    it("should return true when token exists", () => {
      storageMock.getItem.mockReturnValue("token-123");

      expect(service.hasToken()).toBe(true);
    });

    it("should return false when token is absent", () => {
      storageMock.getItem.mockReturnValue(null);

      expect(service.hasToken()).toBe(false);
    });
  });

  describe("setToken / removeToken / observeToken", () => {
    it("should store the token and emit it", () => {
      const emitted: (string | null)[] = [];
      service.observeToken().subscribe((value) => emitted.push(value));

      service.setToken("new-token");

      expect(localStorageMock.set).toHaveBeenCalledWith(CaoVariables.STORAGE_AUTH, "new-token");
      expect(emitted).toEqual([null, "new-token"]);
    });

    it("should remove the token (including legacy key) and emit null", () => {
      localStorage.setItem(`${LEGACY_PREFIX}${CaoVariables.STORAGE_AUTH}`, "legacy");
      const emitted: (string | null)[] = [];
      service.observeToken().subscribe((value) => emitted.push(value));

      service.removeToken();

      expect(localStorageMock.remove).toHaveBeenCalledWith(CaoVariables.STORAGE_AUTH);
      expect(localStorage.getItem(`${LEGACY_PREFIX}${CaoVariables.STORAGE_AUTH}`)).toBeNull();
      expect(emitted).toEqual([null, null]);
    });

    it("should emit the initial token already present in storage", () => {
      storageMock.getItem.mockReturnValue("initial-token");
      const fresh = setup();
      const emitted: (string | null)[] = [];

      fresh.observeToken().subscribe((value) => emitted.push(value));

      expect(emitted).toEqual(["initial-token"]);
    });
  });

  describe("getDecodedToken", () => {
    it("should return null when there is no token", () => {
      expect(service.getDecodedToken()).toBeNull();
      expect(jwtDecodeMock).not.toHaveBeenCalled();
    });

    it("should return the decoded payload", () => {
      const payload = { name: "John" };
      storageMock.getItem.mockReturnValue("token-123");
      jwtDecodeMock.mockReturnValue(payload);

      expect(service.getDecodedToken()).toEqual(payload);
      expect(jwtDecodeMock).toHaveBeenCalledWith("token-123");
    });

    it("should propagate decode errors (no try/catch in the service)", () => {
      storageMock.getItem.mockReturnValue("invalid");
      jwtDecodeMock.mockImplementation(() => {
        throw new Error("invalid token");
      });

      expect(() => service.getDecodedToken()).toThrow("invalid token");
    });
  });

  describe("getRole", () => {
    beforeEach(() => {
      storageMock.getItem.mockReturnValue("token-123");
    });

    it("should return null when there is no token", () => {
      storageMock.getItem.mockReturnValue(null);

      expect(service.getRole()).toBeNull();
    });

    it("should return the first role from resource_access", () => {
      jwtDecodeMock.mockReturnValue({
        resource_access: {
          "client-a": { roles: [] },
          "client-b": { roles: ["admin", "user"] },
        },
      });

      expect(service.getRole()).toBe("admin");
    });

    it("should fall back to realm_access roles", () => {
      jwtDecodeMock.mockReturnValue({
        resource_access: { "client-a": { roles: [] } },
        realm_access: { roles: ["realm-role"] },
      });

      expect(service.getRole()).toBe("realm-role");
    });

    it("should return null when no roles are found", () => {
      jwtDecodeMock.mockReturnValue({ realm_access: { roles: [] } });

      expect(service.getRole()).toBeNull();
    });

    it("should return null and log when decoding fails", () => {
      jwtDecodeMock.mockImplementation(() => {
        throw new Error("boom");
      });

      expect(service.getRole()).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("isTokenExpired", () => {
    beforeEach(() => {
      vi.spyOn(Date, "now").mockReturnValue(NOW_MS);
    });

    it("should return true when there is no token", () => {
      expect(service.isTokenExpired()).toBe(true);
    });

    it("should return true when exp is missing", () => {
      storageMock.getItem.mockReturnValue("token-123");
      jwtDecodeMock.mockReturnValue({});

      expect(service.isTokenExpired()).toBe(true);
    });

    it("should return true when exp is in the past or now", () => {
      storageMock.getItem.mockReturnValue("token-123");

      jwtDecodeMock.mockReturnValue({ exp: NOW_S - 10 });
      expect(service.isTokenExpired()).toBe(true);

      jwtDecodeMock.mockReturnValue({ exp: NOW_S });
      expect(service.isTokenExpired()).toBe(true);
    });

    it("should return false when exp is in the future", () => {
      storageMock.getItem.mockReturnValue("token-123");
      jwtDecodeMock.mockReturnValue({ exp: NOW_S + 60 });

      expect(service.isTokenExpired()).toBe(false);
    });

    it("should return true and log when decoding fails", () => {
      storageMock.getItem.mockReturnValue("token-123");
      jwtDecodeMock.mockImplementation(() => {
        throw new Error("boom");
      });

      expect(service.isTokenExpired()).toBe(true);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("isTokenExpiringSoon", () => {
    beforeEach(() => {
      vi.spyOn(Date, "now").mockReturnValue(NOW_MS);
    });

    it("should return true when there is no token", () => {
      expect(service.isTokenExpiringSoon()).toBe(true);
    });

    it("should return true when exp is missing", () => {
      storageMock.getItem.mockReturnValue("token-123");
      jwtDecodeMock.mockReturnValue({});

      expect(service.isTokenExpiringSoon()).toBe(true);
    });

    it("should return true when token expires within 5 minutes", () => {
      storageMock.getItem.mockReturnValue("token-123");

      jwtDecodeMock.mockReturnValue({ exp: NOW_S + 4 * 60 });
      expect(service.isTokenExpiringSoon()).toBe(true);

      jwtDecodeMock.mockReturnValue({ exp: NOW_S + 5 * 60 });
      expect(service.isTokenExpiringSoon()).toBe(true);
    });

    it("should return false when token expires after 5 minutes", () => {
      storageMock.getItem.mockReturnValue("token-123");
      jwtDecodeMock.mockReturnValue({ exp: NOW_S + 5 * 60 + 1 });

      expect(service.isTokenExpiringSoon()).toBe(false);
    });

    it("should return true and log when decoding fails", () => {
      storageMock.getItem.mockReturnValue("token-123");
      jwtDecodeMock.mockImplementation(() => {
        throw new Error("boom");
      });

      expect(service.isTokenExpiringSoon()).toBe(true);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("refresh token", () => {
    it("should store the refresh token", () => {
      service.setRefreshToken("refresh-1");

      expect(localStorageMock.set).toHaveBeenCalledWith(CaoVariables.REFRESH_TOKEN, "refresh-1");
    });

    it("should return the refresh token from storage", () => {
      localStorageMock.get.mockReturnValue("refresh-1");

      expect(service.getRefreshToken()).toBe("refresh-1");
      expect(localStorageMock.get).toHaveBeenCalledWith(CaoVariables.REFRESH_TOKEN);
    });

    it("should report whether a refresh token exists", () => {
      localStorageMock.get.mockReturnValue("refresh-1");
      expect(service.hasRefreshToken()).toBe(true);

      localStorageMock.get.mockReturnValue(null);
      expect(service.hasRefreshToken()).toBe(false);
    });

    it("should remove the refresh token and its legacy key", () => {
      localStorage.setItem(`${LEGACY_PREFIX}${CaoVariables.REFRESH_TOKEN}`, "legacy");

      service.removeRefreshToken();

      expect(localStorageMock.remove).toHaveBeenCalledWith(CaoVariables.REFRESH_TOKEN);
      expect(localStorage.getItem(`${LEGACY_PREFIX}${CaoVariables.REFRESH_TOKEN}`)).toBeNull();
    });
  });

  describe("user data", () => {
    it("should not store anything when there is no token", () => {
      service.setUserDataFromToken();

      expect(localStorageMock.set).not.toHaveBeenCalled();
    });

    it("should store user data extracted from the token", () => {
      storageMock.getItem.mockReturnValue("token-123");
      jwtDecodeMock.mockReturnValue({
        name: "John Doe",
        preferred_username: "john",
        email: "john@example.com",
      });

      service.setUserDataFromToken();

      expect(localStorageMock.set).toHaveBeenCalledWith(CaoVariables.USER, {
        name: "John Doe",
        username: "john",
        email: "john@example.com",
      });
    });

    it("should store nulls for missing claims", () => {
      storageMock.getItem.mockReturnValue("token-123");
      jwtDecodeMock.mockReturnValue({});

      service.setUserDataFromToken();

      expect(localStorageMock.set).toHaveBeenCalledWith(CaoVariables.USER, {
        name: null,
        username: null,
        email: null,
      });
    });

    it("should log and not store when decoding fails", () => {
      storageMock.getItem.mockReturnValue("token-123");
      jwtDecodeMock.mockImplementation(() => {
        throw new Error("boom");
      });

      service.setUserDataFromToken();

      expect(localStorageMock.set).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });

    it("should return the stored user data", () => {
      const user = { name: "John", username: "john", email: "john@example.com" };
      localStorageMock.get.mockReturnValue(user);

      expect(service.getUserData()).toEqual(user);
      expect(localStorageMock.get).toHaveBeenCalledWith(CaoVariables.USER);
    });

    it("should remove user data and its legacy key", () => {
      localStorage.setItem(`${LEGACY_PREFIX}${CaoVariables.USER}`, "legacy");

      service.removeUserData();

      expect(localStorageMock.remove).toHaveBeenCalledWith(CaoVariables.USER);
      expect(localStorage.getItem(`${LEGACY_PREFIX}${CaoVariables.USER}`)).toBeNull();
    });
  });

  describe("removeAllTokens", () => {
    it("should remove token, refresh token and user data", () => {
      const emitted: (string | null)[] = [];
      service.observeToken().subscribe((value) => emitted.push(value));

      service.removeAllTokens();

      expect(localStorageMock.remove).toHaveBeenCalledWith(CaoVariables.STORAGE_AUTH);
      expect(localStorageMock.remove).toHaveBeenCalledWith(CaoVariables.REFRESH_TOKEN);
      expect(localStorageMock.remove).toHaveBeenCalledWith(CaoVariables.USER);
      expect(emitted[emitted.length - 1]).toBeNull();
    });
  });

  describe("legacy key migration", () => {
    const legacyName = `${LEGACY_PREFIX}${CaoVariables.REFRESH_TOKEN}`;

    it("should migrate a legacy value and remove the legacy key", () => {
      localStorage.setItem(legacyName, JSON.stringify({ value: "legacy-refresh" }));

      service.getRefreshToken();

      expect(localStorageMock.set).toHaveBeenCalledWith(CaoVariables.REFRESH_TOKEN, "legacy-refresh");
      expect(localStorage.getItem(legacyName)).toBeNull();
    });

    it("should migrate object values for user data", () => {
      const user = { name: "John", username: "john", email: "john@example.com" };
      const userLegacy = `${LEGACY_PREFIX}${CaoVariables.USER}`;
      localStorage.setItem(userLegacy, JSON.stringify({ value: user }));

      service.getUserData();

      expect(localStorageMock.set).toHaveBeenCalledWith(CaoVariables.USER, user);
      expect(localStorage.getItem(userLegacy)).toBeNull();
    });

    it("should not migrate when the new key already exists", () => {
      localStorageMock.has.mockReturnValue(true);
      localStorage.setItem(legacyName, JSON.stringify({ value: "legacy-refresh" }));

      service.getRefreshToken();

      expect(localStorageMock.set).not.toHaveBeenCalled();
      expect(localStorage.getItem(legacyName)).not.toBeNull();
    });

    it("should do nothing when there is no legacy value", () => {
      service.getRefreshToken();

      expect(localStorageMock.set).not.toHaveBeenCalled();
    });

    it("should remove the legacy key without setting when value is undefined", () => {
      localStorage.setItem(legacyName, JSON.stringify({}));

      service.getRefreshToken();

      expect(localStorageMock.set).not.toHaveBeenCalled();
      expect(localStorage.getItem(legacyName)).toBeNull();
    });

    it("should remove the legacy key when its JSON is invalid", () => {
      localStorage.setItem(legacyName, "not-json");

      service.getRefreshToken();

      expect(localStorageMock.set).not.toHaveBeenCalled();
      expect(localStorage.getItem(legacyName)).toBeNull();
    });

    it("should attempt the migration only once per key", () => {
      const getItemSpy = vi.spyOn(Storage.prototype, "getItem");

      service.getRefreshToken();
      service.getRefreshToken();

      const legacyReads = getItemSpy.mock.calls.filter(([name]) => name === legacyName);
      expect(legacyReads).toHaveLength(1);
    });

    it("should not touch localStorage when not running in the browser", () => {
      const server = setup("server");
      const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
      const removeItemSpy = vi.spyOn(Storage.prototype, "removeItem");

      server.getRefreshToken();
      server.removeRefreshToken();

      expect(getItemSpy).not.toHaveBeenCalled();
      expect(removeItemSpy).not.toHaveBeenCalled();
      expect(localStorageMock.set).not.toHaveBeenCalled();
    });
  });
});