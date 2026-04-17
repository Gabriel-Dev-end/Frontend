import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductFormComponent } from './product-form.component';
import { ProductDTO } from '@core/models/product.models';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.get('title')?.value).toBe('');
    expect(component.form.get('status')?.value).toBe('ANUNCIADO');
  });

  it('should require title field', () => {
    const titleControl = component.form.get('title');
    titleControl?.setValue('');
    expect(titleControl?.hasError('required')).toBe(true);

    titleControl?.setValue('Test Product');
    expect(titleControl?.hasError('required')).toBe(false);
  });

  it('should validate price minimum value', () => {
    const priceControl = component.form.get('price');
    priceControl?.setValue(0);
    expect(priceControl?.hasError('min')).toBe(true);

    priceControl?.setValue(0.01);
    expect(priceControl?.hasError('min')).toBe(false);

    priceControl?.setValue(100);
    expect(priceControl?.invalid).toBe(false);
  });

  it('should patch values when product is provided', () => {
    const mockProduct: ProductDTO = {
      id: 1,
      title: 'Test Product',
      price: 99.99,
      description: 'Test Description',
      category: 'Electronics',
      imageBase64: 'base64string',
      status: 'VENDIDO'
    };

    component.product = mockProduct;
    component.ngOnInit();

    expect(component.form.get('title')?.value).toBe('Test Product');
    expect(component.form.get('price')?.value).toBe(99.99);
    expect(component.form.get('status')?.value).toBe('VENDIDO');
  });

  it('should emit formSubmit event with valid form data', () => {
    const emitSpy = vi.spyOn(component.formSubmit, 'emit');

    component.form.patchValue({
      title: 'Test Product',
      price: 50,
      description: 'Test',
      category: 'Test',
      status: 'ANUNCIADO'
    });

    component.onSubmit();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit formSubmit event with invalid form', () => {
    const emitSpy = vi.spyOn(component.formSubmit, 'emit');

    component.form.patchValue({
      title: '',
      price: 0
    });

    component.onSubmit();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should have image preview when imageBase64 is set', () => {
    component.form.patchValue({
      imageBase64: 'data:image/png;base64,abc123'
    });

    expect(component.hasImagePreview()).toBe(true);
  });
});
