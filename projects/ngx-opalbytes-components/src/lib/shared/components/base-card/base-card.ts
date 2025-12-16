import { Component, Input } from '@angular/core';

export interface IBaseCardData {
  title: string;
  description?: string;
  typeCard: "VIDEO" | "IMAGE";
  sourceData: string;
  imgThumbnail?: string;
  isTargetBlank?: boolean;
  isControlsEnabled: boolean;
}

export interface IListBaseCardData {
  header: string;
  cardList: IBaseCardData[];
}


@Component({
  selector: 'lib-base-card',
  imports: [],
  templateUrl: './base-card.html',
  styleUrl: './base-card.css',
})
export class BaseCard {
  @Input() baseCardData!: IBaseCardData;
}
