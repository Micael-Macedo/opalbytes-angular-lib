import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-card',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './card.html',
})
export class Card {
  @Input() header: TemplateRef<any> | null = null;
  @Input() content: TemplateRef<any> | null = null;
  @Input() footer: TemplateRef<any> | null = null;

  @Input() className = '';
  @Input() headerClass = '';
  @Input() contentClass = '';
  @Input() footerClass = '';

  cn(...classes: (string | undefined | null)[]) {
    return classes.filter(Boolean).join(' ');
  }
}
