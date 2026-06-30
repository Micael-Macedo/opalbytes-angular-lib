import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  signal,
  WritableSignal,
  inject,
  PLATFORM_ID,
  ElementRef,
  ViewChildren,
  ViewChild,
  HostBinding,
} from '@angular/core';

import { LucideDynamicIcon } from '@lucide/angular';
import { Subscription } from 'rxjs';

import { CaoTabPanel } from '../tab-panel/tab-panel';


export interface ICaoTabChangeEvent {
  previousIndex: number;
  index: number;
  tab: CaoTabPanel;
}

@Component({
  selector: 'cao-tab-group',
  standalone: true,
  imports: [NgTemplateOutlet, LucideDynamicIcon],
  templateUrl: './tab-group.component.html',
  styleUrl: './tab-group.component.scss',
  host: { class: 'cao-tab-group' },
})
export class CaoTabGroup implements AfterContentInit, OnDestroy {
  @HostBinding('style')
  get _hostStyles(): Record<string, string> {
    return {
      '--cao-tab-label-height': this.labelHeight,
      '--cao-tab-label-px': this.labelPaddingX,
      '--cao-tab-label-gap': this.labelGap,
      '--cao-tab-color-text': this.colorText,
      '--cao-tab-color-active': this.colorActive,
      '--cao-tab-color-hover-bg': this.colorHoverBg,
      '--cao-tab-color-disabled': this.colorDisabled,
      '--cao-tab-color-ink-bar': this.colorInkBar,
      '--cao-tab-color-header-border': this.colorHeaderBorder,
      '--cao-tab-ink-bar-height': this.inkBarHeight,
      '--cao-tab-content-pt': this.contentPaddingTop,
      '--cao-tab-radius': this.labelRadius,
    };
  }
  @Input()
  set selectedIndex(val: number) {
    this.selectIndex(val, false);
  }
  get selectedIndex(): number {
    return this.activeIndex();
  }

  @Input() labelHeight = '48px';
  @Input() labelPaddingX = '16px';
  @Input() labelGap = '6px';
  @Input() colorText = '#6b7280';
  @Input() colorActive = '#4f46e5';
  @Input() colorHoverBg = '#f3f4f6';
  @Input() colorDisabled = '#d1d5db';
  @Input() colorInkBar = '#4f46e5';
  @Input() colorHeaderBorder = '#e5e7eb';
  @Input() inkBarHeight = '2px';
  @Input() contentPaddingTop = '20px';
  @Input() labelRadius = '4px';
  @Input() animationDuration = '300ms';
  @Input() dynamicHeight = false;

  @Input() labelAlign: 'start' | 'center' | 'end' = 'start';
  @Input() iconColorActive = ''
  @Input() iconColorInactive = ''
  @Input() strokeWidthIcon = 1

  @Output() readonly selectedTabChange = new EventEmitter<ICaoTabChangeEvent>();

  @Output() readonly focusChange = new EventEmitter<number>();

  @ContentChildren(CaoTabPanel) tabs!: QueryList<CaoTabPanel>;
  @ViewChildren('tabBtn') tabBtns!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChild('inkBar') inkBar!: ElementRef<HTMLElement>;

  readonly activeIndex: WritableSignal<number> = signal(0);

  private activatedSet = new Set<number>();

  tabList: CaoTabPanel[] = [];

  private subs = new Subscription();
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  ngAfterContentInit(): void {
    this.tabList = this.tabs.toArray();
    this.activatedSet.add(this.activeIndex());

    this.subs.add(
      this.tabs.changes.subscribe(() => {
        this.tabList = this.tabs.toArray();
        const safe = Math.min(this.activeIndex(), this.tabList.length - 1);
        this.activeIndex.set(Math.max(0, safe));
        this.scheduleInkBar();
      })
    );

    this.scheduleInkBar();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  selectTab(index: number): void {
    this.selectIndex(index, true);
  }

  get activeTab(): CaoTabPanel | null {
    return this.tabList[this.activeIndex()] ?? null;
  }

  isActive(index: number): boolean {
    return this.activeIndex() === index;
  }
  wasActivated(index: number): boolean {
    return this.activatedSet.has(index);
  }

  onTabClick(index: number): void {
    if (this.tabList[index]?.isDisabled) {return;}
    this.selectIndex(index, true);
  }

  onKeydown(event: KeyboardEvent, currentIndex: number): void {
    let next = currentIndex;

    switch (event.key) {
      case 'ArrowRight': next = this.nextEnabled(currentIndex, 1); break;
      case 'ArrowLeft': next = this.nextEnabled(currentIndex, -1); break;
      case 'Home': next = this.nextEnabled(-1, 1); break;
      case 'End': next = this.nextEnabled(this.tabList.length, -1); break;
      default: return;
    }

    event.preventDefault();
    this.selectIndex(next, true);
    this.focusTab(next);
  }

  onFocus(index: number): void {
    this.focusChange.emit(index);
  }

  private nextEnabled(from: number, dir: 1 | -1): number {
    const tabs = this.tabList;
    let idx = from + dir;
    while (idx >= 0 && idx < tabs.length) {
      if (!tabs[idx].isDisabled) {return idx;}
      idx += dir;
    }
    return from;
  }

  private selectIndex(index: number, emit: boolean): void {
    if (!this.tabList) {
      this.activeIndex.set(Math.max(0, index));
      return;
    }
    const clamped = Math.max(0, Math.min(index, this.tabList.length - 1));
    const previous = this.activeIndex();
    if (clamped === previous && emit) {return;}

    this.activeIndex.set(clamped);
    this.activatedSet.add(clamped);

    if (emit) {
      this.selectedTabChange.emit({
        previousIndex: previous,
        index: clamped,
        tab: this.tabList[clamped],
      });
    }

    this.scheduleInkBar();
  }

  private focusTab(index: number): void {
    this.tabBtns?.toArray()[index]?.nativeElement?.focus();
  }

  scheduleInkBar(): void {
    if (!this.isBrowser) {return;}
    requestAnimationFrame(() => this.updateInkBar());
  }

  private updateInkBar(): void {
    const btns = this.tabBtns?.toArray();
    const bar = this.inkBar?.nativeElement;
    if (!btns || !bar) {return;}

    const btn = btns[this.activeIndex()]?.nativeElement;
    if (!btn) {return;}

    bar.style.width = `${btn.offsetWidth}px`;
    bar.style.transform = `translateX(${btn.offsetLeft}px)`;
    bar.style.transitionDuration = this.animationDuration;
  }
}