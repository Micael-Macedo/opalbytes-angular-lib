import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatTooltip } from "@angular/material/tooltip";

export type CaoCardVariant = "horizontal" | "square";

export interface ICaoCardBadge {
  label: string;
  color?: string;
  borderColor?: string;
  bg?: string;
}

export interface ICaoCardMeta {
  icon: string;
  label: string;
}

export interface ICaoCardAvatar {
  initials?: string;
  src?: string;
  color?: string;
}


@Component({
  selector: "cao-card",
  templateUrl: "./card.component.html",
  styleUrl: "./card.component.css",
  imports: [CommonModule, MatTooltip],
})
export class CaoCardComponent {
  @Input() variant: CaoCardVariant = "horizontal";
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() detail?: string;
  @Input() detailColor?: string;
  @Input() icon?: string;
  @Input() avatar?: ICaoCardAvatar;
  @Input() meta?: ICaoCardMeta[];
  @Input() badge?: ICaoCardBadge;
  @Input() selected = false;
  @Input() clickable = false;
  @Input() bgColor="bg-white"
  @Input() borderColor="border-gray-200"

  @Output() readonly cardClick = new EventEmitter<void>();

  get avatarBg(): string {
    return this.avatar?.color ?? "bg-orange-400";
  }

  handleClick(): void {
    if (this.clickable) {this.cardClick.emit();}
  }

  handleKeydown(event: KeyboardEvent): void {
    if (this.clickable && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      this.cardClick.emit();
    }
  }
}
