import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ToastService, ToastData } from "@core/services/toast.service";

@Component({
    selector:'app-toast',
    standalone:true,
    imports:[CommonModule],
    templateUrl:'./toast.component.html'
})
export class ToastComponent implements OnInit{
    toast: ToastData|null = null;

    constructor(private toastService: ToastService){}

    ngOnInit(): void {
        this.toastService.toast$.subscribe(data => {
            this.toast = data
        });
    }
    close(){
        this.toast = null;
    }
}