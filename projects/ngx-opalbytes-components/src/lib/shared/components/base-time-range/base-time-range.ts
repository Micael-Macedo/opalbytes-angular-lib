import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDatepickerModule, MatDateRangeInput } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'cao-base-time-range',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './base-time-range.html',
  styleUrl: './base-time-range.css',
})
export class BaseTimeRange implements OnInit{
  @Input() label = "";
  @Input() max: Date | undefined;
  @Input() minDate: Date | undefined;
  @Input() maxDate: Date | undefined;
  @Input() startDate: Date | undefined;
  @Input() finalDate: Date | undefined;
  @Input() dataCy?: string
  @Input() controlName = "";

  @Output() readonly rangeSelected = new EventEmitter<Date[]>();

  @ViewChild(MatDateRangeInput) dateRangeInput!: MatDateRangeInput<Date>;

  ngOnInit(): void {
    if(!this.dataCy){
      this.dataCy = `time-range-${this.label}`
    }
  }

  onSelectStartDate(event: any) {
    const date = event.target.value as Date;
    this.startDate = date;
    this.finalDate = undefined;

    const maxDate = new Date(date);
    maxDate.setDate(maxDate.getDate() + 30);

    this.maxDate = maxDate;
  }

  onInputMaxDate(event: any) {
    const finalDate = event.target.value as Date;
    if (this.startDate && finalDate) {
      const data = [this.startDate, finalDate];
      this.rangeSelected.emit(data);
    }
  }

  clearInputs() {
    this.max = undefined;
    this.minDate = undefined;
    this.maxDate = undefined;
    this.startDate = undefined;
    this.finalDate = undefined;

    this.dateRangeInput._startInput.value = "";
    this.dateRangeInput._endInput.value = "";
  }
}
