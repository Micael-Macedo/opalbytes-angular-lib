import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxOpalbytesFeaturePdf } from './ngx-opalbytes-feature-pdf';

describe('NgxOpalbytesFeaturePdf', () => {
  let component: NgxOpalbytesFeaturePdf;
  let fixture: ComponentFixture<NgxOpalbytesFeaturePdf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxOpalbytesFeaturePdf]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxOpalbytesFeaturePdf);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
