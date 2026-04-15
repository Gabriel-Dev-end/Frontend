import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductDTO, ProductRequestDTO } from '@core/models/product.models';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  @Input() product?: ProductDTO;

  @Output() formSubmit = new EventEmitter<ProductRequestDTO>();

  form!: FormGroup;
  statuses: string[] = ['ANUNCIADO', 'VENDIDO', 'DESATIVADO'];
  isLoading: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();

    if (this.product) {
      this.form.patchValue(this.product);
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      price: ['', [Validators.min(0.01)]],
      description: [''],
      category: [''],
      status: ['ANUNCIADO'],
      imageBase64: ['']
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue: ProductRequestDTO = this.form.value;
      this.formSubmit.emit(formValue);
    }
  }

  get title() {
    return this.form.get('title');
  }

  get price() {
    return this.form.get('price');
  }

  get description() {
    return this.form.get('description');
  }

  get category() {
    return this.form.get('category');
  }

  get status() {
    return this.form.get('status');
  }

  get imageBase64() {
    return this.form.get('imageBase64');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const base64 = e.target?.result as string;
        this.form.patchValue({ imageBase64: base64 });
      };
      reader.readAsDataURL(file);
    }
  }

  hasImagePreview(): boolean {
    return !!this.imageBase64?.value;
  }

  getImageSource(): string {
    const imageBase64 = this.imageBase64?.value;
    if (imageBase64?.startsWith('data:image')) {
      return imageBase64;
    }
    return imageBase64 ? `data:image/png;base64,${imageBase64}` : '';
  }
}
