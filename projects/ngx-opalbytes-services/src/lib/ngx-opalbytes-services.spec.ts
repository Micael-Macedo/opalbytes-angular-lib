import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxOpalbytesServices } from './ngx-opalbytes-services';

describe('NgxOpalbytesServices', () => {
  let component: NgxOpalbytesServices;
  let fixture: ComponentFixture<NgxOpalbytesServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxOpalbytesServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxOpalbytesServices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
