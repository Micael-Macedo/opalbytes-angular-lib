import { describe, it, expect, beforeEach, vi } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Injector } from "@angular/core";
import { of } from "rxjs";
import { firstValueFrom } from "rxjs";

import { BaseResourceService } from "./base.service";
import { BaseResourceModel } from "../../models";
import { HelpConfig } from "../../config";

class DemoResource extends BaseResourceModel {
  name!: string;
}

describe("BaseResourceService", () => {
  let service: BaseResourceService<DemoResource>;
  let injector: Injector;
  const helpConfigMock = {
    httpGet: vi.fn(),
    httpPost: vi.fn(),
    httpPut: vi.fn(),
    httpPatch: vi.fn(),
    httpDelete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HelpConfig,
          useValue: helpConfigMock,
        },
        { provide: String, useValue: "/api/demo" },
      ],
    });
    injector = TestBed.inject(Injector);
    service = new BaseResourceService<DemoResource>("/api/demo", injector);
  });

  it("should be created and resolve HelpConfig from injector", () => {
    expect(service).toBeTruthy();
    expect(service["helpConfig"]).toBe(helpConfigMock);
  });

  it("should call getById", async () => {
    helpConfigMock.httpGet.mockReturnValue(of({ data: [], success: true }));

    await firstValueFrom(service!.getById(1));
    expect(helpConfigMock.httpGet).toHaveBeenCalledWith("/api/demo/1");
  });

  it("should call getAll with url only when no params", async () => {
    helpConfigMock.httpGet.mockReturnValue(of({ data: [] }));

    await firstValueFrom(service!.getAll());
    expect(helpConfigMock.httpGet).toHaveBeenCalledWith("/api/demo", undefined);
  });

  it("should call pageCount", async () => {
    helpConfigMock.httpGet.mockReturnValue(of({ count: 10 }));

    await firstValueFrom(service!.pageCount());
    expect(helpConfigMock.httpGet).toHaveBeenCalledWith("/api/demo/pagecount", undefined);
  });

  it("should call create via httpPost", async () => {
    const resource = new DemoResource();
    resource.name = "Novo";
    helpConfigMock.httpPost.mockReturnValue(of({ data: [resource] }));

    await firstValueFrom(service!.create(resource));
    expect(helpConfigMock.httpPost).toHaveBeenCalledWith("/api/demo", resource);
  });

  it("should call update with id", async () => {
    helpConfigMock.httpPut.mockReturnValue(of({ data: [] }));

    await firstValueFrom(service!.update({ name: "X" }, "9"));
    expect(helpConfigMock.httpPut).toHaveBeenCalledWith("/api/demo/9", { name: "X" });
  });

  it("should call update without id", async () => {
    helpConfigMock.httpPut.mockReturnValue(of({ data: [] }));

    await firstValueFrom(service!.update({ name: "X" }));
    expect(helpConfigMock.httpPut).toHaveBeenCalledWith("/api/demo", { name: "X" });
  });

  it("should call activate via httpPatch", async () => {
    helpConfigMock.httpPatch.mockReturnValue(of({ data: [] }));

    await firstValueFrom(service!.activate("5"));
    expect(helpConfigMock.httpPatch).toHaveBeenCalledWith("/api/demo/5/Activate", {});
  });

  it("should call deactivate via httpPatch", async () => {
    helpConfigMock.httpPatch.mockReturnValue(of({ data: [] }));

    await firstValueFrom(service!.deactivate("5"));
    expect(helpConfigMock.httpPatch).toHaveBeenCalledWith("/api/demo/5/Deactivate", {});
  });

  it("should call delete via httpDelete", async () => {
    helpConfigMock.httpDelete.mockReturnValue(of(null));

    await firstValueFrom(service!.delete(3));
    expect(helpConfigMock.httpDelete).toHaveBeenCalledWith("/api/demo/3");
  });

  it("should call lock via httpPost with query params", async () => {
    helpConfigMock.httpPost.mockReturnValue(of({ data: [] }));

    await firstValueFrom(service!.lock(1, "justificativa"));
    expect(helpConfigMock.httpPost).toHaveBeenCalledWith(
      "/api/demo/bloquear?id=1&justificativa=justificativa",
      null
    );
  });

  it("should call unlock via httpPost with query params", async () => {
    helpConfigMock.httpPost.mockReturnValue(of({ data: [] }));

    await firstValueFrom(service!.unlock(2, "ok"));
    expect(helpConfigMock.httpPost).toHaveBeenCalledWith("/api/demo/desbloquear?id=2&justificativa=ok", null);
  });
});