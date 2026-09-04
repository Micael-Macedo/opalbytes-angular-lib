import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoSkeletonComponent } from './skeleton';

describe('CaoSkeletonComponent', () => {
  let component: CaoSkeletonComponent;
  let fixture: ComponentFixture<CaoSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoSkeletonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
