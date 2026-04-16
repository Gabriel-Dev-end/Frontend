import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormBuilder,FormGroup,Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  isRegistering = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.iniciarFormularios();

    if (this.authService.loged()) {
      this.router.navigate(['/products']);
    }
  }

  private iniciarFormularios(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]]
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator() });
  }

  onSubmit(): void {
    const form = this.isRegistering ? this.registerForm : this.loginForm;

    if (form.invalid) {
      this.marcarCamposComoTocados(form);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isRegistering) {
      this.handleRegister(form.value);
    } else {
      this.handleLogin(form.value);
    }
  }

  private handleLogin(credentials: any): void {
    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.show('Login realizado com sucesso!', 'success');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        this.errorMessage = 'E-mail ou senha incorretos.';
        this.toastService.show(this.errorMessage, 'error');
      }
    });
  }

  private handleRegister(data: any): void {
    const registerData = {
      email: data.email,
      password: data.password
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Register response:', response);
        this.toastService.show('Conta criada com sucesso! Faça login.', 'success');
        this.toggleRegistering();
        this.loginForm.patchValue({ email: data.email });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Register error:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Error body:', err.error);
        this.errorMessage = err?.error?.detail || err?.error || 'Erro ao criar conta. E-mail pode estar em uso.';
        this.toastService.show(this.errorMessage, 'error');
      }
    });
  }

  toggleRegistering(): void {
    this.isRegistering = !this.isRegistering;
    this.errorMessage = '';
    this.loginForm.reset();
    this.registerForm.reset();
  }

  private passwordMatchValidator() {
    return (formGroup: FormGroup) => {
      const password = formGroup.get('password');
      const confirmPassword = formGroup.get('confirmPassword');

      if (!password || !confirmPassword) return null;

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPassword.setErrors(null);
        return null;
      }
    };
  }

  private marcarCamposComoTocados(form: FormGroup): void {
    Object.values(form.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  get currentEmailControl(): AbstractControl | null {
    return this.isRegistering ? this.registerForm.get('email') : this.loginForm.get('email');
  }

  get currentPasswordControl(): AbstractControl | null {
    return this.isRegistering ? this.registerForm.get('password') : this.loginForm.get('password');
  }
}