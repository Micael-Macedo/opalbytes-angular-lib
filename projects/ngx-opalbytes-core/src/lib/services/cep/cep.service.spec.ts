import { CEP_ENDPOINTS } from './../../constants/cep-endpoints.constants';
import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting, HttpTestingController } from "@angular/common/http/testing";

import { CEPService } from "./cep.service";

describe("CEPService", () => {
  let service: CEPService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CEPService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return null for invalid CEP", () => {
    let result: unknown = "not-null";
    service.searchCEP("123").subscribe((r) => (result = r));
    expect(result).toBeNull();
  });

  it("should return null for CEP that is not 8 characters", () => {
    let result: unknown = "not-null";
    service.searchCEP("abc").subscribe((r) => (result = r));
    expect(result).toBeNull();
  });

  it("should search CEP via BrasilAPI", () => {
    const mockResponse = {
      cep: "01001-000",
      street: "Praça da Sé",
      neighborhood: "Sé",
      city: "São Paulo",
      state: "SP",
    };

    let result: unknown;
    service.searchCEP("01001000").subscribe((r) => (result = r));

    const req = httpMock.expectOne(`${CEP_ENDPOINTS.BRASIL_API_CEP}/01001000`);
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);

    expect(result).toEqual({
      cep: "01001-000",
      logradouro: "Praça da Sé",
      bairro: "Sé",
      localidade: "São Paulo",
      uf: "SP",
    });
  });

  it("should fallback to ViaCEP when BrasilAPI fails", () => {
    const viaCepResponse = {
      cep: "01001-000",
      logradouro: "Praça da Sé",
      bairro: "Sé",
      localidade: "São Paulo",
      uf: "SP",
    };

    let result: unknown;
    service.searchCEP("01001000").subscribe((r) => (result = r));

    const brasilReq = httpMock.expectOne(`${CEP_ENDPOINTS.BRASIL_API_CEP}/01001000`);
    brasilReq.flush({ error: "internal error" }, { status: 500, statusText: "Server Error" });

    const viaReq = httpMock.expectOne(`${CEP_ENDPOINTS.VIA_CEP}/01001000/json/`);
    expect(viaReq.request.method).toBe("GET");
    viaReq.flush(viaCepResponse);

    expect(result).toEqual({
      cep: "01001-000",
      logradouro: "Praça da Sé",
      bairro: "Sé",
      localidade: "São Paulo",
      uf: "SP",
    });
  });

  it("should return null when ViaCEP reports the CEP as not found", () => {
    let result: unknown = "not-null";
    service.searchCEP("01001000").subscribe((r) => (result = r));

    const brasilReq = httpMock.expectOne(`${CEP_ENDPOINTS.BRASIL_API_CEP}/01001000`);
    brasilReq.flush({ error: "boom" }, { status: 500, statusText: "Server Error" });

    const viaReq = httpMock.expectOne(`${CEP_ENDPOINTS.VIA_CEP}/01001000/json/`);
    viaReq.flush({ erro: true });

    expect(result).toBeNull();
  });

  it("should toggle loading while searching", () => {
    expect(service.loading$()).toBe(false);

    service.searchCEP("01001000").subscribe();

    const req = httpMock.expectOne(`${CEP_ENDPOINTS.BRASIL_API_CEP}/01001000`);
    expect(service.loading$()).toBe(true);

    req.flush({
      cep: "01001-000",
      street: "Praça da Sé",
      neighborhood: "Sé",
      city: "São Paulo",
      state: "SP",
    });

    expect(service.loading$()).toBe(false);
  });

  it("should fetch municipalities", () => {
    const mockMunicipalities = [
      { CODIGO_IBGE: "3509502", nome: "Campinas" },
      { CODIGO_IBGE: "3550308", nome: "São Paulo" },
    ];

    let result: unknown;
    service.fetchMunicipalities("SP").subscribe((r) => (result = r));

    const req = httpMock.expectOne(`${CEP_ENDPOINTS.BRASIL_API_MUNICIPALITIES}/SP`);
    req.flush(mockMunicipalities);

    expect(result).toEqual([
      { code: "3509502", name: "Campinas" },
      { code: "3550308", name: "São Paulo" },
    ]);
  });

  it("should return empty array when municipalities fetch fails", () => {
    let result: unknown = "not-array";
    service.fetchMunicipalities("XX").subscribe((r) => (result = r));

    const req = httpMock.expectOne(`${CEP_ENDPOINTS.BRASIL_API_MUNICIPALITIES}/XX`);
    req.flush({ error: "boom" }, { status: 500, statusText: "Server Error" });

    expect(result).toEqual([]);
  });

  it("should expose the list of Brazilian states", () => {
    expect(service.states.length).toBe(27);
  });
});