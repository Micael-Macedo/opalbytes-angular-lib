import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxOpalbytesComponents } from './ngx-opalbytes-components';

describe('NgxOpalbytesComponents', () => {
  let component: NgxOpalbytesComponents;
  let fixture: ComponentFixture<NgxOpalbytesComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxOpalbytesComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxOpalbytesComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
