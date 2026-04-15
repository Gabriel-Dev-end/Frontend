import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '@shared/components/toast/toast.component';
import { HeaderComponent } from '@shared/components/header';

@Component({
  imports:[CommonModule, RouterOutlet, ToastComponent, HeaderComponent],
  standalone:true,
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('sipel-frontend');
}
