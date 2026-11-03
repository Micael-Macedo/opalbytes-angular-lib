import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { CaoWidgetService } from "./widget.service";
import { CaoBaseWidgetComponent } from "./base-widget";

@Component({
  selector: "app-spec-widget",
  imports: [CaoBaseWidgetComponent],
  template: `
    <cao-base-widget
      [title]="title()"
      [subtitle]="subtitle()"
      [widgetIcon]="widgetIcon()"
      [widgetData]="widgetData()"
      (closeRequest)="closeWidget()"
      (save)="saveWidget()"
    >
      <div class="spec-content">conteudo</div>
      <div class="spec-data">{{ widgetData()?.label }} - {{ widgetData()?.total }}</div>
    </cao-base-widget>
  `,
})
class SpecWidget extends CaoBaseWidgetComponent<{ label: string; total: number }> {}

@Component({
  selector: "app-spec-shell-widget",
  imports: [CaoBaseWidgetComponent],
  template: `
    <cao-base-widget
      [title]="'Widget externo'"
      (save)="onSave()"
      (closeRequest)="forwardCloseRequest()"
    >
      <div class="shell-content">conteudo do shell</div>
    </cao-base-widget>
  `,
})
class SpecShellWidget extends CaoBaseWidgetComponent {
  saved = 0;

  onSave(): void {
    this.saved++;
  }
}

function getWidgetElement(): HTMLElement | null {
  return document.querySelector("app-spec-widget");
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("CaoWidgetService", () => {
  let service: CaoWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaoWidgetService);
  });

  afterEach(() => {
    service.close();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("opens a widget extending BaseWidget via portal", () => {
    service.open(SpecWidget, { inputs: { title: "Gerar exames" } });

    const el = getWidgetElement();
    expect(el).toBeTruthy();
    expect(el!.querySelector("cao-base-widget")).toBeTruthy();
    expect(el!.querySelector(".spec-content")?.textContent?.trim()).toBe("conteudo");
  });

  it("passes generic data so the widget renders it without refetching", () => {
    service.open(SpecWidget, {
      data: { label: "Sessões hoje", total: 42 },
    });

    const el = getWidgetElement()!;
    expect(el.querySelector(".spec-data")?.textContent?.trim()).toBe("Sessões hoje - 42");
  });

  it("disposes an existing widget before opening a new one", () => {
    service.open(SpecWidget);
    expect(getWidgetElement()).toBeTruthy();

    service.open(SpecWidget);
    expect(document.querySelectorAll("app-spec-widget").length).toBe(1);
  });

  it("removes the overlay when the user clicks outside of a nested widget", async () => {
    service.open(SpecShellWidget);

    const backdrop = document.querySelector(
      "app-spec-shell-widget .widget-backdrop"
    ) as HTMLElement;
    backdrop.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    backdrop.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));

    await delay(600);

    expect(document.querySelector("app-spec-shell-widget")).toBeNull();
  });
});
