import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductTableComponent } from './product-table.component';
import { ProductDTO } from '@core/models/product.models';

describe('ProductTableComponent', () => {
  let component: ProductTableComponent;
  let fixture: ComponentFixture<ProductTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display products when provided', () => {
    const mockProducts: ProductDTO[] = [
      {
        id: 1,
        title: 'Product 1',
        price: 100,
        description: 'Test product',
        category: 'Category',
        imageBase64: '',
        status: 'ANUNCIADO'
      }
    ];

    component.products = mockProducts;
    fixture.detectChanges();

    const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(1);
  });

  it('should emit edit event when edit button clicked', () => {
    spyOn(component.edit, 'emit');
    const mockProduct: ProductDTO = {
      id: 1,
      title: 'Product 1',
      price: 100,
      description: 'Test product',
      category: 'Category',
      imageBase64: '',
      status: 'ANUNCIADO'
    };

    component.onEdit(mockProduct);
    expect(component.edit.emit).toHaveBeenCalledWith(mockProduct);
  });

  it('should emit delete event when confirmed', () => {
    spyOn(component.delete, 'emit');
    spyOn(window, 'confirm').and.returnValue(true);

    component.onDelete(1);
    expect(component.delete.emit).toHaveBeenCalledWith(1);
  });

  it('should not emit delete event when not confirmed', () => {
    spyOn(component.delete, 'emit');
    spyOn(window, 'confirm').and.returnValue(false);

    component.onDelete(1);
    expect(component.delete.emit).not.toHaveBeenCalled();
  });

  it('should format price correctly', () => {
    const formatted = component.formatPrice(100);
    expect(formatted).toContain('100');
    expect(formatted).toContain('R$');
  });

  it('should display empty state when no products', () => {
    component.products = [];
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyState).toBeTruthy();
    expect(emptyState.textContent).toContain('Nenhum produto disponível');
  });

  it('should display loading state when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const loadingState = fixture.nativeElement.querySelector('.loading-state');
    expect(loadingState).toBeTruthy();
  });
});
