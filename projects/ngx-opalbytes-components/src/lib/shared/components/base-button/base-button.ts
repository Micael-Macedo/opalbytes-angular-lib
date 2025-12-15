import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'lib-base-button',
  imports: [MatTooltipModule, CommonModule],
  templateUrl: './base-button.html',
  styleUrl: './base-button.css',
})
export class BaseButton implements OnInit {
  @Output() readonly buttonClick = new EventEmitter<void>();
  @Input() buttonText: string = "Clique!";
  @Input() isDarkMode: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() useMaterialIcons: boolean = false;
  @Input() btnClass: string = "";
  @Input() tooltip: string = "";

  @Input() trailingIcon?: string;
  @Input() leadingIcon?: string;
  @Input() dataCy?: string;

  ngOnInit(): void {
    if (!this.dataCy) {
      this.dataCy = `btn-${this.buttonText.replace(/\s+/g, '-').toLowerCase()}`;
    }

    this.tooltip = this.buttonText
  }

  onClick(): void {
    if (!this.isDisabled && !this.isLoading) {
      this.buttonClick.emit();
    }
  }
}
