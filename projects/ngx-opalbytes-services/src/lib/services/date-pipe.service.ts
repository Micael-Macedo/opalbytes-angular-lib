import { DatePipe } from "@angular/common";
import { inject, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CaoDatePipeService {
  readonly datePipe = inject(DatePipe);

  constructor() {}

  getConvertedDatePipe(value: Date, transform: string): string {
    const result = this.datePipe.transform(value, transform);

    return result ?? "";
  }
}
