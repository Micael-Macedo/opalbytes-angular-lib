import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaoAccordionItemComponent } from './accordion-item.component';


describe('AccordionItem', () => {
  let component: CaoAccordionItemComponent;
  let fixture: ComponentFixture<CaoAccordionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoAccordionItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoAccordionItemComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
