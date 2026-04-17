import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: any;
  let router: any;

  beforeEach(async () => {
    const authServiceMock = {
      getUsuario: vi.fn().mockReturnValue(null),
      logout: vi.fn()
    };
    const routerMock = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user on init', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    authService.getUsuario.mockReturnValue(mockUser);

    fixture.detectChanges();

    expect(authService.getUsuario).toHaveBeenCalled();
    expect(component.user).toEqual(mockUser);
  });

  it('should call logout and navigate on logout button click', () => {
    authService.getUsuario.mockReturnValue({ id: 1, email: 'test@example.com' });
    fixture.detectChanges();

    component.onLogout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
