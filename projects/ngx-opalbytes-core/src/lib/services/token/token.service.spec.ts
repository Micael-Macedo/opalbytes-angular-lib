import { describe, it, expect, beforeEach, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CaoTokenGuardService } from "./token.service";
import { StorageService } from "../storage/storage.service";
import { CaoVariables } from "../../enums/variaveis.enum";

describe("CaoTokenGuardService", () => {
  let service: CaoTokenGuardService;
  const storageMock = {
    getItem: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storageMock }],
    });
    service = TestBed.inject(CaoTokenGuardService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return token when present", () => {
    storageMock.getItem.mockReturnValue("token-123");
    expect(service.getToken()).toBe("token-123");
    expect(storageMock.getItem).toHaveBeenCalledWith(CaoVariables.STORAGE_AUTH);
  });

  it("should return null when there is no token", () => {
    storageMock.getItem.mockReturnValue(null);
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