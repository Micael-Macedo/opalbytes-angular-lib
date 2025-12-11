import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxOpalbytesUtils } from './ngx-opalbytes-utils';

describe('NgxOpalbytesUtils', () => {
  let component: NgxOpalbytesUtils;
  let fixture: ComponentFixture<NgxOpalbytesUtils>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxOpalbytesUtils]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxOpalbytesUtils);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
