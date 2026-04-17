import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product';
import { ProductDTO } from '@core/models/product.models';
import { describe, it, expect, beforeEach } from 'vitest';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products with pagination', () => {
    const mockResponse = {
      message: 'Success',
      data: [
        {
          id: 1,
          title: 'Product 1',
          price: 100,
          description: 'Test',
          category: 'Category',
          imageBase64: '',
          status: 'ANUNCIADO' as const
        }
      ],
      pageNumber: 0,
      pageSize: 10,
      totalElements: 1,
      totalPages: 1
    };

    service.getProducts(0, 10).subscribe(response => {
      expect(response.data.length).toBe(1);
      expect(response.totalElements).toBe(1);
    });

    const req = httpMock.expectOne(req => req.url.includes('/api/v1/products'));
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
