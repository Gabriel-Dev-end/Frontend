import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, tap, catchError, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import {
    AuthRequestDTO,
    RegisterRequestDTO,
    LoginSucessfullDTO,
    UserProfileDTO,
    UserDTO
}from "../models/auth.model";

@Injectable({
    providedIn:'root'
})
export class AuthService{
    private readonly API_URL = `${environment.apiUrl}/auth`;
    private readonly headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    constructor(private http: HttpClient){}

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Erro desconhecido';
        
        if (error.status === 0) {
            errorMessage = 'Servidor indisponível. Verifique a conexão.';
        } else if (error.status === 400) {
            errorMessage = error.error?.message || 'Dados inválidos. Verifique os campos.';
        } else if (error.status === 401) {
            errorMessage = 'Email ou senha incorretos.';
        } else if (error.status === 403) {
            errorMessage = 'Acesso negado. Verifique suas credenciais.';
        } else if (error.status === 404) {
            errorMessage = 'Recurso não encontrado.';
        } else if (error.status === 409) {
            errorMessage = error.error?.message || 'Email já cadastrado.';
        } else if (error.status === 500) {
            errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
        } else if (error.status >= 500) {
            errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
        } else {
            errorMessage = error.error?.message || error.message || 'Erro ao processar requisição';
        }
        
        console.error('HTTP Error:', { status: error.status, message: errorMessage });
        return throwError(() => new Error(errorMessage));
    }
    
    login(credentials:AuthRequestDTO): Observable<LoginSucessfullDTO>{
        return this.http.post<LoginSucessfullDTO>(
            `${this.API_URL}/login`,
            credentials,
            { headers: this.headers }
        ).pipe(
            tap(res => {
                this.salvarToken(res.data.token);
                this.salvarExpiracao(res.data.expiresIn);
                this.salvarUsuario(res.data.user);
            }),
            catchError((err: HttpErrorResponse) => this.handleError(err))
        );
    }

    register(credentials: RegisterRequestDTO): Observable<string> {
        return this.http.post(
            `${this.API_URL}/register`,
            credentials,
            { 
                responseType: 'text',
                headers: this.headers
            }
        ).pipe(
            tap(res => {
                console.log('Registro realizado com sucesso');
            }),
            catchError((err: HttpErrorResponse) => this.handleError(err))
        );
    }

    getProfile():Observable<UserProfileDTO>{
        return this.http.post<UserProfileDTO>(`${this.API_URL}/user/profile`,{});
    }
    
    salvarToken(token:string):void{
        if (typeof localStorage === 'undefined') {
            return;
        }
        localStorage.setItem('token',token);
    }
    salvarExpiracao(exp:number):void{
        if (typeof localStorage === 'undefined') {
            return;
        }
        localStorage.setItem('expiresIn', exp.toString());
    }
    getToken(): string | null {
        if (typeof localStorage === 'undefined') {
            return null;
        }
        return localStorage.getItem('token');
    }
    loged():boolean{
        return !!this.getToken();
    }
    salvarUsuario(user: UserDTO): void {
        if (typeof localStorage === 'undefined') {
            return;
        }
        localStorage.setItem('user', JSON.stringify(user));
    }

    getUsuario(): UserDTO | null {
        if (typeof localStorage === 'undefined') {
            return null;
        }
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    logout():void{
        if (typeof localStorage === 'undefined') {
            return;
        }
        localStorage.removeItem('token');
        localStorage.removeItem('expiresIn');
        localStorage.removeItem('user');
    }
}
