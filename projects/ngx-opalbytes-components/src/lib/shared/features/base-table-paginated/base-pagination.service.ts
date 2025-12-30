import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BasePaginationService {
  private pageSubject = new BehaviorSubject<number>(1);
  private pageSizeSubject = new BehaviorSubject<number>(10);
  private totalItemsSubject = new BehaviorSubject<number>(0);

  public currentPage$: Observable<number> = this.pageSubject.asObservable();
  public pageSize$: Observable<number> = this.pageSizeSubject.asObservable();
  public totalItems$: Observable<number> = this.totalItemsSubject.asObservable();

  constructor() {}

  /**
   * Sets the current page number
   * @param page The page number to set
   */
  setPage(page: number): void {
    if (page !== this.pageSubject.value) {
      this.pageSubject.next(page);
    }
  }

  /**
   * Sets the page size
   * @param size The page size to set
   */
  setPageSize(size: number): void {
    if (size !== this.pageSizeSubject.value) {
      this.pageSizeSubject.next(size);
    }
  }

  /**
   * Sets the total number of items
   * @param total The total number of items
   */
  setTotalItems(total: number): void {
    if (total !== this.totalItemsSubject.value) {
      this.totalItemsSubject.next(total);
    }
  }

  /**
   * Gets the current page
   */
  getCurrentPage(): number {
    return this.pageSubject.value;
  }

  /**
   * Gets the current page size
   */
  getPageSize(): number {
    return this.pageSizeSubject.value;
  }

  /**
   * Gets the total number of items
   */
  getTotalItems(): number {
    return this.totalItemsSubject.value;
  }

  /**
   * Resets pagination to default values
   */
  reset(): void {
    this.pageSubject.next(1);
    this.pageSizeSubject.next(10);
    this.totalItemsSubject.next(0);
  }
}
