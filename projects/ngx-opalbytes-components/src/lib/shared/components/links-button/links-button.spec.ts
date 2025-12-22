import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from "@angular/core/testing";
import { INavContent, INavLink, LinksButton } from "./links-button";
import { provideRouter } from "@angular/router";
import { signal } from "@angular/core";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("LinksButton", () => {
  let component: LinksButton;
  let fixture: ComponentFixture<LinksButton>;

  let modalServiceSpy: {
    showModal: ReturnType<typeof vi.fn>;
    closeAllModals: ReturnType<typeof vi.fn>;
  };
  let storageServiceSpy: {
    setItem: ReturnType<typeof vi.fn>;
    getItem: ReturnType<typeof vi.fn>;
  };
  let alertServiceSpy: {
    show: ReturnType<typeof vi.fn>;
  };

  const mockLink: INavLink = {
    text: "INICIAR ATENDIMENTO",
    url: "reception",
  };

  const mockDisabledLink: INavLink = {
    text: "ATENDIMENTO",
    url: "receptio",
    disabled: true,
  };

  const mockDirectRoute: INavLink = {
    text: "ATENDIMENTO",
    url: "receptio",
    disabled: false,
    directRoute: true,
  };

  beforeEach(async () => {
    storageServiceSpy = {
      setItem: vi.fn(),
      getItem: vi.fn(),
    };
    
    modalServiceSpy = {
      showModal: vi.fn(),
      closeAllModals: vi.fn(),
    };
    
    alertServiceSpy = {
      show: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LinksButton],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {provide: ComponentFixtureAutoDetect, useValue: true}
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LinksButton);
    component = fixture.componentInstance;

    const defaultData: INavContent = {
      title: "Default",
      links: [{ text: "Default", url: "/" }],
    };
    component.navContent = signal(defaultData);

    fixture.detectChanges();
  });

  it("deveria criar", () => {
    expect(component).toBeTruthy();
  });

  it("deveria ter informações", () => {
    const expectedData: INavContent = {
      title: "Atendimento",
      links: [{ text: "cuidado", url: "route" }],
    };
    component.navContent = signal(expectedData);
    expect(component.navContent().title).toBe(expectedData.title);
  });

  it("deve navegar para a rota", () => {
    const expectedURL = "/";
    component["navigateTo"](expectedURL);
    expect(component.router.url).toBe(expectedURL);
  });

  describe("validação para navegação", () => {
    it("deve navegar caso o link esteja disponivel", () => {
      const navigateToSpy = vi.spyOn(component as any, "navigateTo");
      component.isValidationRequired(mockLink);

      expect(navigateToSpy).toHaveBeenCalledWith(mockLink.url);
    });

    it("não deve navegar caso o link esteja desabilitado", () => {
      const navigateToSpy = vi.spyOn(component as any, "navigateTo");
      component.isValidationRequired(mockDisabledLink);

      expect(navigateToSpy).not.toHaveBeenCalled();
    });

    it("deve navegar considerando a raiz do projeto", () => {
      const directRouteSpy = vi.spyOn(component as any, "directRoute");
      component.isValidationRequired(mockDirectRoute);

      expect(directRouteSpy).toHaveBeenCalledWith(mockDirectRoute.url);
    });
  });

  describe("directRoute", () => {
    it("deve navegar a url raiz do projeto", () => {
      vi.spyOn(component.router, "navigate");
      component["directRoute"](mockLink.url);

      expect(component.router.navigate).toHaveBeenCalledWith([mockLink.url]);
    });
  });
});