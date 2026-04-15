import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';

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

    expect(title.textContent).toContain('Delete Product?');
    expect(message.textContent).toContain('This action cannot be undone.');
  });

  it('should emit confirm event when confirm button is clicked', () => {
    spyOn(component.confirm, 'emit');
    component.onConfirm();
    expect(component.confirm.emit).toHaveBeenCalled();
  });

  it('should emit cancel event when cancel button is clicked', () => {
    spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should apply btn-danger class when isDangerous is true', () => {
    component.isDangerous = true;
    fixture.detectChanges();

    const confirmBtn = fixture.nativeElement.querySelector('.btn-confirm');
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
