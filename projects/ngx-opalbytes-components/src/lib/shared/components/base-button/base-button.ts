import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'lib-base-button',
  imports: [CommonModule, MatTooltipModule, NgOptimizedImage],
  templateUrl: './base-button.html',
  styleUrl: './base-button.css',
})
export class BaseButton implements OnInit {
  @Output() readonly buttonClick = new EventEmitter<void>();

  @Input() buttonText = "Clique!";
  @Input() isDarkMode = false;
  @Input() isDisabled = false;
  @Input() isLoading = false;
  @Input() useMaterialIcons = false;
  @Input() btnClass = "";

  @Input() tooltip?:string;
  @Input() trailingIcon?: string;
  @Input() leadingIcon?: string;
  @Input() dataCy?: string;

  ngOnInit(): void {
    if (!this.dataCy) {
      this.dataCy = `btn-${this.buttonText.replace(/\s+/g, '-').toLowerCase()}`;
    }

    if(!this.tooltip && this.buttonText.length >= 20){
      this.tooltip = this.buttonText
    }
  }

  onClick(): void {
    if (!this.isDisabled && !this.isLoading) {
      this.buttonClick.emit();
    }
  }
}
