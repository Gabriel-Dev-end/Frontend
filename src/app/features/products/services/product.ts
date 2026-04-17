import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ProductDTO, ProductRequestDTO, ProductsResponseDTO } from "@core/models/product.models";

@Injectable({
  providedIn:'root'
})
export class ProductService{
  private readonly API='/api/v1/products';

  constructor(private http: HttpClient){}

  getProducts(page:number, size: number): Observable<ProductsResponseDTO>{
    const params = new HttpParams()
    .set('page',page.toString())
    .set('size',size.toString())
    .set('sort','id,asc');

    return this.http.get<ProductsResponseDTO>(this.API,{params});
  }
  getProductById(id:number|string): Observable<ProductDTO>{
    return this.http.get<ProductDTO>(`${this.API}/${id}`);
  }
  createProduct(dados:ProductRequestDTO): Observable<ProductDTO>{
    return this.http.post<ProductDTO>(`${this.API}/new-product`, dados);
  }
  updateProduct(id:number|string, dados:ProductRequestDTO):Observable<ProductDTO>{
    return this.http.put<ProductDTO>(`${this.API}/${id}`, dados);
  }
  deleteProduct(id:number|string):Observable<void>{
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}