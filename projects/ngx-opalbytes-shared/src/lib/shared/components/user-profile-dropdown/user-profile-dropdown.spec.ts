import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileDropdown } from './user-profile-dropdown';

describe('UserProfileDropdown', () => {
  let component: UserProfileDropdown;
  let fixture: ComponentFixture<UserProfileDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileDropdown],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileDropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
