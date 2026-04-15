type ProductStatus = 'VENDIDO'|'DESATIVADO'|'ANUNCIADO'

export interface ProductDTO{
    id:number,
    title:string,
    price:number,
    description:string,
    category:string,
    imageBase64:string,
    status:ProductStatus
}
export interface ProductRequestDTO{
    title:string,
    price?:number,
    description?:string,
    category?:string,
    imageBase64?:string,
    status?:ProductStatus
}
export interface ProductsResponseDTO{
    message:string,
    data:ProductDTO[],
    pageNumber:number,
    pageSize:number,
    totalElements:number,
    totalPages:number
}
