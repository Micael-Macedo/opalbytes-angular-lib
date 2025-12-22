import { Component, inject, Input, Signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

export interface INavContent {
  title: string;
  links: INavLink[];
  permissions?: string[];
  directRoute?: boolean;
}
export interface INavLink {
  text: string;
  url: string;
  disabled?: boolean;
  isValidationRequired?: boolean;
  dataCy?: string;
  directRoute?: boolean;
}

@Component({
  standalone: true,
  selector: "cao-links-button",
  templateUrl: "./links-button.html",
  styleUrl: "./links-button.css",
})
export class LinksButton {
  @Input({ required: true }) navContent!: Signal<INavContent>;
  router = inject(Router);
  route = inject(ActivatedRoute);

  isValidationRequired(link: INavLink) {
    if (link.disabled) {
      return;
    }
    link.directRoute ? this.directRoute(link.url) : this.navigateTo(link.url);
  }

  private navigateTo(url: string) {
    this.router.navigate([url], { relativeTo: this.route });
  }

  private directRoute(url: string) {
    this.router.navigate([url]);
  }

}
