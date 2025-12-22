import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'cao-paginator',
  imports: [MaterialModule],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css',
})
export class Paginator {
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50];
  @Input() customClass = "";
  @Input() showFirstLastButtons = true;

  @Output() readonly pageEvent = new EventEmitter<PageEvent>();

  onPageEvent(event: PageEvent): void {
    this.pageEvent.emit(event)
  }
}
