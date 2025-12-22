import { FilterTableService, TableComponent, TableService } from './base-table';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { BehaviorSubject } from "rxjs";
import { describe, it, expect, beforeEach, vi } from "vitest";

const configMock = {
  columns: ["name", "age"],
  columnData: {
    name: {
      visible: true,
      header: "Name",
      type: "STRING",
      element: "text",
      buttons: [],
    },
    age: {
      visible: true,
      header: "Age",
      type: "NUMBER",
      element: "text",
      buttons: [],
    },
  },
  data: [],
};

describe("TableComponent", () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let tableService: TableService;


  const tableServiceStub = {
    tableConfig$: new BehaviorSubject(configMock),
    visibleColumns$: new BehaviorSubject(["name", "age"]),
    data$: new BehaviorSubject([{ name: "Alice", age: 30 }]),
    toggleColumnVisibility: vi.fn(),
  };

  const filterTableServiceStub = {
    filter$: new BehaviorSubject(""),
  };

  const liveAnnouncerStub = {
    announce: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TableComponent,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        MatMenuModule,
        MatIconModule,
        MatTooltipModule,
      ],
      providers: [
        { provide: TableService, useValue: tableServiceStub },
        { provide: FilterTableService, useValue: filterTableServiceStub },
        { provide: LiveAnnouncer, useValue: liveAnnouncerStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    tableService = TestBed.inject(TableService);
    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("deve alternar a visibilidade da coluna", () => {
    component.toggleColumnVisibility("name");
    expect(tableService.toggleColumnVisibility).toHaveBeenCalledWith("name");
  });

  it("deve lidar com valores null em filterPredicate", () => {
    const predicate = component.dataSource.filterPredicate;
    const data = { name: null, age: 25 };
    const filter = "25";
    expect(predicate(data, filter)).toBe(true);
  });

  it("deve lidar com valores undefined em filterPredicate", () => {
    const predicate = component.dataSource.filterPredicate;
    const data = { name: undefined, age: 25 };
    const filter = "25";
    expect(predicate(data, filter)).toBe(true);
  });

  it("deve retornar false se termo de filtro não for encontrado", () => {
    const predicate = component.dataSource.filterPredicate;
    const data = { name: "Bob", age: 40 };
    const filter = "alice";
    expect(predicate(data, filter)).toBe(false);
  });

  it("deve selecionar todas as linhas", () => {
    component.dataSource.data = [{ id: 1 }, { id: 2 }];
    component.toggleAllRows();
    expect(component.selection.selected.length).toBe(2);
  });

  it("deve limpar todas as linhas se todas estiverem selecionadas", () => {
    component.dataSource.data = [{ id: 1 }, { id: 2 }];
    component.selection.select(...component.dataSource.data);
    component.toggleAllRows();
    expect(component.selection.selected.length).toBe(0);
  });

  it("deve anunciar mudança de ordenação", () => {
    const announcer = TestBed.inject(LiveAnnouncer);
    component.announceSortChange({ active: "name", direction: "asc" });
    expect(announcer.announce).toHaveBeenCalledWith("Ordenado ascendente");

    component.announceSortChange({ active: "", direction: "" });
    expect(announcer.announce).toHaveBeenCalledWith("Ordenação removida");
  });

  it("deve retornar metadados corretos da coluna", () => {
    expect(component.getColumnHeader("name")).toBe("Name");
    expect(component.getColumnType("name")).toBe("STRING");
    expect(component.getColumnElement("name")).toBe("text");
    expect(component.getColumnButtons("name")).toEqual([]);
  });

  it("deve retornar valores padrão quando a configuração da coluna estiver faltando", () => {
    component.tableConfig = {
      columns: ["name"],
      columnData: {},
      data: [],
    };

    expect(component.isColumnVisible("name")).toBe(true);
    expect(component.getColumnHeader("name")).toBe("name");
    expect(component.getColumnType("name")).toBe("STRING");
    expect(component.getColumnElement("name")).toBe("name");
    expect(component.getColumnButtons("name")).toEqual([]);
  });

  it("deve retornar valores padrão quando a coluna for undefined", () => {
    component.tableConfig = {
      columns: ["name"],
      columnData: { name: undefined as any },
      data: [],
    };

    expect(component.isColumnVisible("name")).toBe(true);
    expect(component.getColumnHeader("name")).toBe("name");
    expect(component.getColumnType("name")).toBe("STRING");
    expect(component.getColumnElement("name")).toBe("name");
    expect(component.getColumnButtons("name")).toEqual([]);
  });

  it("deve retornar valores padrão quando tableConfig for null", () => {
    component.tableConfig = null as any;

    expect(component.isColumnVisible("name")).toBe(true);
    expect(component.getColumnHeader("name")).toBe("name");
    expect(component.getColumnType("name")).toBe("STRING");
    expect(component.getColumnElement("name")).toBe("name");
    expect(component.getColumnButtons("name")).toEqual([]);
  });

  it("deve limpar seleção se todas as linhas estiverem selecionadas", () => {
    component.dataSource.data = [{ id: 1 }, { id: 2 }];
    component.selection.select(...component.dataSource.data);
    vi.spyOn(component.selection, "clear");
    vi.spyOn(component.selection, "select");

    component.toggleAllRows();

    expect(component.selection.clear).toHaveBeenCalledWith();
    expect(component.selection.select).not.toHaveBeenCalled();
  });

  it("deve limpar seleção quando todas as linhas estiverem selecionadas", () => {
    const data = [{ id: 1 }, { id: 2 }];
    component.dataSource.data = data;
    component.selection.select(...data);

    const clearSpy = vi.spyOn(component.selection, "clear");
    const selectSpy = vi.spyOn(component.selection, "select");

    component.toggleAllRows();

    expect(clearSpy).toHaveBeenCalledWith();
    expect(selectSpy).not.toHaveBeenCalled();
  });

  it("deve selecionar todas as linhas se nem todas estiverem selecionadas", () => {
    const data = [{ id: 1 }, { id: 2 }];
    component.dataSource.data = data;

    component.selection.clear();
    const clearSpy = vi.spyOn(component.selection, "clear");
    const selectSpy = vi.spyOn(component.selection, "select");

    component.toggleAllRows();

    expect(selectSpy).toHaveBeenCalledTimes(2);

    expect(selectSpy).toHaveBeenNthCalledWith(1, data[0]);
    expect(selectSpy).toHaveBeenNthCalledWith(2, data[1]);

    expect(clearSpy).not.toHaveBeenCalled();
  });

  it("deve lidar corretamente com sortingDataAccessor para diferentes tipos", () => {
    const accessor = component.dataSource.sortingDataAccessor;

    const stringItem = { name: "Alice" };
    const numberItem = { age: 30 };
    const booleanItem = { active: true };
    const objectItem = { date: new Date("2020-01-01") };
    const undefinedItem = { unknown: undefined };

    expect(accessor(stringItem, "name")).toBe("alice");
    expect(accessor(numberItem, "age")).toBe(30);
    expect(accessor(booleanItem, "active")).toBe(1);
    expect(accessor(objectItem, "date")).toBe(objectItem.date.valueOf());
    expect(accessor(undefinedItem, "unknown")).toBeUndefined();
  });

  it("deve aplicar filterPredicate e incluir valores falsy", () => {
    const predicate = component.dataSource.filterPredicate;

    const data = { name: "Alice", age: 0, active: false, note: null };
    const filter = "alice";

    expect(predicate(data, filter)).toBe(true);
  });

  it("deve lidar com valores string falsy em filterPredicate", () => {
    const predicate = component.dataSource.filterPredicate;

    const data = { name: "", age: 25 };
    const filter = "25";

    expect(predicate(data, filter)).toBe(true);
  });

  it("deve ordenar boolean false como 0", () => {
    const accessor = component.dataSource.sortingDataAccessor;
    const item = { active: false };
    expect(accessor(item, "active")).toBe(0);
  });

  it("deve ordenar object null como string vazia", () => {
    const accessor = component.dataSource.sortingDataAccessor;
    const item = { data: null };
    expect(accessor(item, "data")).toBe("");
  });
});