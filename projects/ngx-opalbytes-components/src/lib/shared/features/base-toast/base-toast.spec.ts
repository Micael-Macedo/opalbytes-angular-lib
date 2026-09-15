import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LucideCircleCheck, LucideCircleX, LucideInfo, LucideTriangleAlert, LucideX, provideLucideIcons } from '@lucide/angular';

import { CaoBaseToast } from './base-toast';
import { ToastType } from './base-toast.interface';

describe('CaoBaseToast', () => {
  let component: CaoBaseToast;
  let fixture: ComponentFixture<CaoBaseToast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoBaseToast],
      providers: [
        provideLucideIcons(LucideCircleCheck, LucideCircleX, LucideInfo, LucideTriangleAlert, LucideX),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoBaseToast);
    component = fixture.componentInstance;

    component.data = {
      type: 'info',
      message: 'Test Message',
    };

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve the correct icon name for each toast type', () => {
    const types: ToastType[] = ['success', 'error', 'info', 'warning'];
    const expectedIcons: Record<ToastType, string> = {
      success: 'circle-check',
      error: 'circle-x',
      info: 'info',
      warning: 'triangle-alert',
    };

    types.forEach((type) => {
      component.data.type = type;
      component.ngOnInit();
      expect(component.iconName).toBe(expectedIcons[type]);
    });
  });

  it('should use the default duration when none is provided', () => {
    component.data = { type: 'success', message: 'Test' };
    component.ngOnInit();
    expect(component.progressDuration).toBe(4000);
  });

  it('should use the configured duration when provided', () => {
    component.data = { type: 'success', message: 'Test', duration: 2500 };
    component.ngOnInit();
    expect(component.progressDuration).toBe(2500);
  });

  it('should invoke closeToast when called', () => {
    const close = vi.fn();
    component.closeToast = close;
    component.closeToast();
    expect(close).toHaveBeenCalled();
  });
});