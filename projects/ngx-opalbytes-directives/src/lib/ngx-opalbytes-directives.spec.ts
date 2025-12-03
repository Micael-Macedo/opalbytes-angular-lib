import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxOpalbytesDirectives } from './ngx-opalbytes-directives';

describe('NgxOpalbytesDirectives', () => {
  let component: NgxOpalbytesDirectives;
  let fixture: ComponentFixture<NgxOpalbytesDirectives>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxOpalbytesDirectives]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxOpalbytesDirectives);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
