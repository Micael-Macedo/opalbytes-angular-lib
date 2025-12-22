import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "cao-footer",
  templateUrl: "./footer.html",
  styleUrl: "./footer.css",
  imports: [ CommonModule ]
})
export class Footer {
  currentYear: number = new Date().getFullYear();
  @Input() currentRoute?:string;
  @Input() footerText?:string;
  @Input() isFixed = true;
}
