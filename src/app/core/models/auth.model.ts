export interface AuthRequestDTO{
    email: string,
    password:string
}
export interface RegisterRequestDTO{
    email: string,
    password: string
}
export interface UserDTO{
    id:number,
    email:string
}
export interface AuthResponseDTO{
    token:string,
    expiresIn:number,
    user:UserDTO
}
export interface LoginSucessfullDTO{
    message:string,
    data:{
        token:string,
        expiresIn:number,
        user:UserDTO
    }
}

export interface UserProfileDTO{
    message:string,
    user:UserDTO
}
export interface TokenValidationDTO{
    message:string,
    user:UserDTO,
    iat:number,
    exp:number
}