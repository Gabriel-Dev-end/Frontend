type ProductStatus = 'Vendido'|'Desativado'|'Anunciado'

export interface ProductDTO{
    id:number,
    title:string,
    price:number,
    description:string,
    category:string,
    status:ProductStatus,
    imageBase64:string
}
export interface ProductRequestDTO{
    title:string,
    price?:number,
    description?:string,
    category?:string,
    status?:ProductStatus,
    imageBase64?:string
}
export interface ProductsResponseDTO{
    message:string,
    data:ProductDTO[],
    pageNumber:number,
    pageSize:number,
    totalElements:number,
    totalPages:number
}
