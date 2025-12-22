import { Injectable } from "@angular/core";

import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FilterTableService {
  private filterSubject = new Subject<string>();

  filter$ = this.filterSubject.asObservable();

  updateFilter(filterValue: string) {
    this.filterSubject.next(filterValue);
  }
}
