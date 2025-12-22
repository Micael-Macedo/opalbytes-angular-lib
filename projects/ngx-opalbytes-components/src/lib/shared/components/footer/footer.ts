import { Component, Input } from "@angular/core";

@Component({
  standalone: true,
  selector: "cao-footer",
  templateUrl: "./footer.html",
  styleUrl: "./footer.css",
})
export class Footer {
  currentYear: number = new Date().getFullYear();
  @Input() currentRoute = "";
  @Input() footerText = "";
}
