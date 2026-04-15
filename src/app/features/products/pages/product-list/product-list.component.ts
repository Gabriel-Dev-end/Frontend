import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';
import { ToastService } from '../../../../core/services/toast.service';
import { ProductDTO } from '@core/models/product.models';
import { LoadingSpinner } from '@shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, LoadingSpinner],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  // Estados de dados e controle
  products: ProductDTO[] = [];
  isLoading = false;
  hasError = false;

  // Estados de paginação
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;

  constructor(
    private productService: ProductService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    // Chamada inicial conforme solicitado: página 0, tamanho 10
    this.getProducts(0, 10);
  }

  getProducts(page: number, size: number): void {
    this.isLoading = true;
    this.hasError = false;

    this.productService.getProducts(page, size).subscribe({
      next: (response) => {
        this.products = response.data;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = page;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.hasError = true;
        this.toastService.show('Erro ao carregar a lista de produtos', 'error');
      }
    });
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.getProducts(newPage, 10);
    }
  }
}