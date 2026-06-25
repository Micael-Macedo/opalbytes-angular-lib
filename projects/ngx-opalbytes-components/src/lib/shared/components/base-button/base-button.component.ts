import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";

import { LucideDynamicIcon } from "@lucide/angular";

@Component({
  standalone: true,
  selector: "cao-button",
  templateUrl: "./base-button.component.html",
  styleUrls: ["./base-button.component.scss"],
  imports: [CommonModule, MatTooltipModule, LucideDynamicIcon],
})
export class CaoBaseButtonComponent implements OnInit{
  @Output() readonly buttonClick = new EventEmitter<void>();

  @Input() buttonText = "Clique!";
  @Input() isDarkMode = false;
  @Input() isDisabled = false;
  @Input() isLoading = false;
  @Input() btnClass = "";

  @Input() tooltip?:string;
  @Input() trailingIcon?: string;
  @Input() leadingIcon?: string;
  @Input() isLucideIcon = true;
  @Input() dataCy?: string;
  @Input() iconColor?: string;
  @Input() strokeWidthIcon = 1

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
