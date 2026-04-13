import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import {
    AuthRequestDTO,
    LoginSucessfullDTO,
    UserProfileDTO
}from "../models/auth.model";

@Injectable({
    providedIn:'root'
})
export class AuthService{
    private readonly API_URL = `${environment.apiUrl}/auth`;
    constructor(private http: HttpClient){}
    login(credentials:AuthRequestDTO): Observable<LoginSucessfullDTO>{
        return this.http.post<LoginSucessfullDTO>(`${this.API_URL}/login`,credentials).pipe(
            tap(res => {
                this.salvarToken(res.data.token);
                this.salvarExpiracao(res.data.expiresIn);
            })
        );
    }
    getProfile():Observable<UserProfileDTO>{
        return this.http.post<UserProfileDTO>(`${this.API_URL}/user/profile`,{});
    }
    salvarToken(token:string):void{
        localStorage.setItem('token',token);
    }
    salvarExpiracao(exp:number):void{
        localStorage.setItem('expiresIn', exp.toString());
    }
    getToken(): string | null {
        return localStorage.getItem('token');
    }
    loged():boolean{
        return !!this.getToken();
    }
    logout():void{
        localStorage.removeItem('token');
        localStorage.removeItem('expiresIn');
    }
}
