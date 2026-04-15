import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';
import { ToastService } from '../../../../core/services/toast.service';
import { ProductDTO, ProductRequestDTO } from '@core/models/product.models';
import { LoadingSpinner } from '@shared/components/loading-spinner/loading-spinner';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { PaginatorComponent } from '@shared/components/paginator/paginator.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinner,
    ProductTableComponent,
    ProductFormComponent,
    ModalComponent,
    ConfirmDialogComponent,
    PaginatorComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  // Estados de dados e controle
  products: ProductDTO[] = [];
  isLoading = false;
  hasError = false;

  // Estados de modal e criação/edição
  isModalOpen = false;
  productSelecionado: ProductDTO | undefined;
  isSubmittingForm = false;

  // Estados de confirmação de deleção
  isConfirmDialogOpen = false;
  productToDelete: ProductDTO | undefined;
  isDeletingProduct = false;

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

  openNewProductModal(): void {
    this.productSelecionado = undefined;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.productSelecionado = undefined;
  }

  createProduct(formData: ProductRequestDTO): void {
    if (this.productSelecionado?.id) {
      this.updateProduct(this.productSelecionado.id, formData);
    } else {
      this.createNewProduct(formData);
    }
  }

  private createNewProduct(formData: ProductRequestDTO): void {
    this.isSubmittingForm = true;

    this.productService.createProduct(formData).subscribe({
      next: (response) => {
        this.isSubmittingForm = false;
        this.toastService.show('Produto criado com sucesso!', 'success');
        this.closeModal();
        this.getProducts(this.currentPage, 10);
      },
      error: (err) => {
        this.isSubmittingForm = false;
        const errorMessage = err?.error?.message || 'Erro ao criar produto';
        this.toastService.show(errorMessage, 'error');
      }
    });
  }

  private updateProduct(id: number, formData: ProductRequestDTO): void {
    this.isSubmittingForm = true;

    this.productService.updateProduct(id, formData).subscribe({
      next: (response) => {
        this.isSubmittingForm = false;
        this.toastService.show('Produto atualizado com sucesso!', 'success');
        this.closeModal();
        this.getProducts(this.currentPage, 10);
      },
      error: (err) => {
        this.isSubmittingForm = false;
        const errorMessage = err?.error?.message || 'Erro ao atualizar produto';
        this.toastService.show(errorMessage, 'error');
      }
    });
  }

  onEditProduct(product: ProductDTO): void {
    this.productSelecionado = product;
    this.isModalOpen = true;
  }

  onDeleteProduct(product: ProductDTO): void {
    this.productToDelete = product;
    this.isConfirmDialogOpen = true;
  }

  closeConfirmDialog(): void {
    this.isConfirmDialogOpen = false;
    this.productToDelete = undefined;
  }

  confirmDelete(): void {
    if (this.productToDelete?.id) {
      this.deleteProduct(this.productToDelete.id);
    }
  }

  private deleteProduct(id: number): void {
    this.isDeletingProduct = true;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.isDeletingProduct = false;
        this.toastService.show('Produto deletado com sucesso!', 'success');
        this.closeConfirmDialog();
        this.getProducts(this.currentPage, 10);
      },
      error: (err) => {
        this.isDeletingProduct = false;
        const errorMessage = err?.error?.message || 'Erro ao deletar produto';
        this.toastService.show(errorMessage, 'error');
      }
    });
  }
}