import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomePanel } from './welcome-panel';

describe('WelcomePanel', () => {
  let component: WelcomePanel;
  let fixture: ComponentFixture<WelcomePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WelcomePanel],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomePanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
