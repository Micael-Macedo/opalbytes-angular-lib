import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatTimepickerOption } from '@angular/material/timepicker';

import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'cao-time-picker',
  imports: [ MaterialModule, CommonModule, ReactiveFormsModule, ],
  templateUrl: './time-picker.html',
  styleUrl: './time-picker.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TimePicker {
  @Input() control: FormControl<Date | null> = new FormControl<Date | null>(null);
  @Input() isDisabled = false;
  @Input() dataCy?: string;
  @Input() set min(v: string) {
    this._min = v;
    this.minInNumber = this.convertStringInNumber(v)
    this.customOptions = this.generateTimeOptions().filter((option) => option.label >= this._min);
  }
  @Input() set max(v: string) {
    this._max = v;
    this.maxInNumber = this.convertStringInNumber(v)
    this.customOptions = this.generateTimeOptions().filter((option) => option.label <= this._max);
  }

  minInNumber = 7;
  maxInNumber = 23;

  @Output() readonly timeChange = new EventEmitter<Date>();

  private _min = "07:00";
  private _max = "23:00";

  customOptions: MatTimepickerOption<Date>[] = this.generateTimeOptions();

  constructor(private _adapter: DateAdapter<any>) {
    this._adapter.setLocale("pt-BR");
  }

  get errorText(): string | null {
    if (!this.control) {return null;}

    if (this.control.hasError("required") || (this.control.touched && !this.control.value)) {
      return "*Campo obrigatório";
    }
    if (this.control.hasError("quarterHour") && this.control.touched) {
      return "Formato inválido";
    }
    return null;
  }

  private convertStringInNumber(hour: string): number{
    const explodedHour = parseInt(hour.split(":")[0])
    if(typeof explodedHour !== 'number'){
      return explodedHour
    }
    return explodedHour
  }

  private generateTimeOptions(): MatTimepickerOption<Date>[] {
    const options: MatTimepickerOption<Date>[] = [];
    const baseDate = new Date(2025, 0, 1);

    for (let hour = this.minInNumber; hour <= this.maxInNumber; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === this.maxInNumber && minute > 0) {continue;}
        const date = new Date(baseDate);
        date.setHours(hour, minute, 0);
        const label = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        options.push({ label, value: date });
      }
    }

    return options;
  }

  updateTimeOptions(options: MatTimepickerOption<Date>[]): void {
    this.customOptions = options;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
