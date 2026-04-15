import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

export interface ToastData {
    message:string;
    tipo: 'success'|'error'
}

@Injectable({
    providedIn:'root'
})
export class ToastService{
    private toastSubject = new Subject<ToastData|null>();
    toast$ = this.toastSubject.asObservable();

    show(message:string, tipo:'success'|'error' = 'success'){
        this.toastSubject.next({message, tipo});

        setTimeout(() => {
            this.toastSubject.next(null);
        }, 3000);
    }
}