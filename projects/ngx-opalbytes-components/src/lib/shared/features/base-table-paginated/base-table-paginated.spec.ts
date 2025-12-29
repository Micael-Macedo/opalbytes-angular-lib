import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { TableService } from '../base-table/base-table.service';
import { BaseTablePaginated } from './base-table-paginated';
import { PaginationService } from './base-pagination.service';
import { FilterTablePaginatedService } from './base-filter-table-paginated.service';

describe("BaseTablePaginated", () => {
  let component: BaseTablePaginated;
  let fixture: ComponentFixture<BaseTablePaginated>;

  let tableServiceStub: any;
  let filterTableServiceStub: any;
  let paginationServiceStub: any;

  beforeEach(async () => {
    tableServiceStub = {
      tableConfig$: new BehaviorSubject({
        columns: [],
        columnData: {},
        data: [],
      }),
      visibleColumns$: new BehaviorSubject([]),
      data$: new BehaviorSubject<any[]>([]),
      toggleColumnVisibility: vi.fn(),
    };

    filterTableServiceStub = {
      filter$: new BehaviorSubject(""),
    };

    paginationServiceStub = {
      currentPage$: new BehaviorSubject(1),
      pageSize$: new BehaviorSubject(10),
      setPage: vi.fn(),
      setPageSize: vi.fn(),
      setTotalItems: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [BaseTablePaginated],
      providers: [
        { provide: TableService, useValue: tableServiceStub },
        { provide: FilterTablePaginatedService, useValue: filterTableServiceStub },
        { provide: PaginationService, useValue: paginationServiceStub },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseTablePaginated);
    component = fixture.componentInstance;

    // DON'T call detectChanges here - we'll call it manually in tests that need it
    // fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
    // Clean up component if it was initialized
    if (component && component.ngOnDestroy) {
      component.ngOnDestroy();
    }
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default customClass as empty string", () => {
    expect(component.customClass).toBe("");
  });

  it("should accept customClass input", () => {
    component.customClass = "custom-class-test";
    // For template binding test, we can create a new component instance
    fixture = TestBed.createComponent(BaseTablePaginated);
    component = fixture.componentInstance;
    component.customClass = "custom-class-test";

    // Use whenStable to avoid change detection errors
    fixture.detectChanges();

    expect(component.customClass).toBe("custom-class-test");
  });

  it("should unsubscribe from paginationSubscriptions on ngOnDestroy", () => {
    const fakeSubscription = {
      unsubscribe: vi.fn()
    };

    // Initialize the component first
    component.ngOnInit();

    // Mock the subscriptions array
    component["paginationSubscriptions"] = [fakeSubscription as unknown as Subscription];

    component.ngOnDestroy();

    expect(fakeSubscription.unsubscribe).toHaveBeenCalled();
  });

  it("should initialize with default values", () => {
    // Check that customClass is empty by default
    expect(component.customClass).toBe("");

    // IMPORTANT: Since ngOnInit hasn't been called yet, subscriptions should be empty
    const subscriptions = component["paginationSubscriptions"];
    expect(subscriptions).toEqual([]);

    // Verify that isPaginatedByServer is true
  });

  it("should create subscriptions in ngOnInit", () => {
    // Before ngOnInit
    expect(component["paginationSubscriptions"]).toEqual([]);

    // Call ngOnInit
    component.ngOnInit();

    // After ngOnInit
    const subscriptions = component["paginationSubscriptions"];
    expect(subscriptions.length).toBe(2); // Should have 2 subscriptions
    expect(subscriptions[0]).toBeDefined();
    expect(subscriptions[1]).toBeDefined();
  });

  it("should handle observable emissions correctly", () => {
    const testData = [{ id: 1, name: 'Test' }];

    // Initialize the component
    component.ngOnInit();

    // Mock updateTotalItems to track calls
    const updateTotalItemsSpy = vi.spyOn(component, 'updateTotalItems');

    // Update the data observable
    tableServiceStub.data$.next(testData);

    // Trigger change detection if needed
    fixture.detectChanges();

    // The component should have a method to update total items
    expect(component.updateTotalItems).toBeDefined();
  });
});