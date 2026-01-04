import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCard } from './login-card';

describe('LoginCard', () => {
  let component: LoginCard;
  let fixture: ComponentFixture<LoginCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginCard],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
