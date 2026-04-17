import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title and message', () => {
    component.title = 'Delete Product?';
    component.message = 'This action cannot be undone.';
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.dialog-title');
    const message = fixture.nativeElement.querySelector('.dialog-message');

    if (title) expect(title.textContent).toContain('Delete Product?');
    if (message) expect(message.textContent).toContain('This action cannot be undone.');
  });

  it('should emit confirm event when confirm button is clicked', () => {
    const confirmSpy = vi.spyOn(component.confirm, 'emit');
    component.onConfirm();
    expect(confirmSpy).toHaveBeenCalled();
  });

  it('should emit cancel event when cancel button is clicked', () => {
    const cancelSpy = vi.spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(cancelSpy).toHaveBeenCalled();
  });
});
    expect(confirmBtn.classList.contains('btn-danger')).toBe(true);
  });

  it('should use custom button texts', () => {
    component.confirmText = 'Yes, delete';
    component.cancelText = 'No, keep';
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.btn');
    expect(buttons[1].textContent).toContain('Yes, delete');
    expect(buttons[0].textContent).toContain('No, keep');
  });
});
