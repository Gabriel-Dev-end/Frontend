import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, tap, catchError } from "rxjs";
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
    
    login(credentials:AuthRequestDTO): Observable<LoginSucessfullDTO>{
        console.log('Login attempt:', credentials.email);
        console.log('API URL:', `${this.API_URL}/login`);
        return this.http.post<LoginSucessfullDTO>(
            `${this.API_URL}/login`,
            credentials,
            { headers: this.headers }
        ).pipe(
            tap(res => {
                console.log('Login successful');
                this.salvarToken(res.data.token);
                this.salvarExpiracao(res.data.expiresIn);
                this.salvarUsuario(res.data.user);
            }),
            catchError(err => {
                console.error('Login HTTP error:', {
                    status: err.status,
                    statusText: err.statusText,
                    message: err.message,
                    url: err.url
                });
                throw err;
            })
        );
    }

    register(credentials: RegisterRequestDTO): Observable<string> {
        console.log('Register attempt:', credentials.email);
        console.log('API URL:', `${this.API_URL}/register`);
        return this.http.post(
            `${this.API_URL}/register`,
            credentials,
            { 
                responseType: 'text',
                headers: this.headers
            }
        ).pipe(
            tap(res => {
                console.log('Register successful:', res);
            }),
            catchError(err => {
                console.error('Register HTTP error:', {
                    status: err.status,
                    statusText: err.statusText,
                    message: err.message,
                    url: err.url
                });
                throw err;
            })
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
