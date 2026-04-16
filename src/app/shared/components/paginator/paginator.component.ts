import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 1;
  @Input() totalElements: number = 0;

  @Output() pageChange = new EventEmitter<number>();

  Math = Math;

  onPreviousPage(): void {
    if (this.currentPage > 0) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  get isPreviousDisabled(): boolean {
    return this.currentPage === 0;
  }

  get isNextDisabled(): boolean {
    return this.currentPage === this.totalPages - 1;
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  onPageSelect(page: number): void {
    if (page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
