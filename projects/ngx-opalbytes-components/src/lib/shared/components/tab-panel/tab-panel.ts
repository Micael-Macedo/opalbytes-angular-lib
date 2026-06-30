import { Component, ContentChild, Input, TemplateRef, ViewChild } from "@angular/core"

import { CaoTabContentDirective } from "./tab-content.directive"
import { CaoTabLabelDirective } from "./tab-label.directive"

@Component({
  selector: "cao-tab-panel",
  imports: [],
  template: `
    <ng-template #implicitContent>
      <ng-content />
    </ng-template>
  `,
  styleUrl: "./tab-panel.css",
})
export class CaoTabPanel {
  @Input() label = ''
  @Input() isLucideIcon = true
  @Input() trailingIcon: string | null =  null
  @Input() leadingIcon: string | null = null
  @Input() isDisabled = false

  @ContentChild(CaoTabLabelDirective, { read: TemplateRef })
  labelTemplate?: TemplateRef<unknown>;

  @ContentChild(CaoTabContentDirective, { read: TemplateRef })
  lazyContent?: TemplateRef<unknown>;

  @ViewChild('implicitContent', { static: true })
  content!: TemplateRef<unknown>;
 }
