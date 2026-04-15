import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDTO } from '@core/models/product.models';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss'
})
export class ProductTableComponent {
  @Input() products: ProductDTO[] = [];
  @Input() isLoading: boolean = false;

  @Output() edit = new EventEmitter<ProductDTO>();
  @Output() delete = new EventEmitter<number>();

  onEdit(product: ProductDTO): void {
    this.edit.emit(product);
  }

  onDelete(id: number): void {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      this.delete.emit(id);
    }
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }
}
