import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginatorComponent } from './paginator.component';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable previous button when currentPage is 0', () => {
    component.currentPage = 0;
    expect(component.isPreviousDisabled).toBe(true);
  });

  it('should enable previous button when currentPage is greater than 0', () => {
    component.currentPage = 2;
    component.totalPages = 5;
    expect(component.isPreviousDisabled).toBe(false);
  });

  it('should disable next button when on last page', () => {
    component.currentPage = 4;
    component.totalPages = 5;
    expect(component.isNextDisabled).toBe(true);
  });

  it('should enable next button when not on last page', () => {
    component.currentPage = 2;
    component.totalPages = 5;
    expect(component.isNextDisabled).toBe(false);
  });

  it('should emit pageChange with previous page number', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 2;
    component.totalPages = 5;
    component.onPreviousPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(1);
  });

  it('should emit pageChange with next page number', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 2;
    component.totalPages = 5;
    component.onNextPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(3);
  });

  it('should generate correct pagesArray', () => {
    component.totalPages = 5;
    expect(component.pagesArray).toEqual([0, 1, 2, 3, 4]);
  });
});
