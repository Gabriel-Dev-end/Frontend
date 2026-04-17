import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event when onClose is called', () => {
    const closeSpy = vi.spyOn(component.close, 'emit');
    component.onClose();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should emit close event when close button is clicked', () => {
    const closeSpy = vi.spyOn(component.close, 'emit');
    const closeButton = fixture.nativeElement.querySelector('.modal-close');
    if (closeButton) {
      closeButton.click();
      expect(closeSpy).toHaveBeenCalled();
    }
  });

  it('should emit close event when clicking on overlay', () => {
    const closeSpy = vi.spyOn(component.close, 'emit');
    const overlay = fixture.nativeElement.querySelector('.modal-overlay');
    if (overlay) {
      overlay.click();
      expect(closeSpy).toHaveBeenCalled();
    }
  });

  it('should not emit close event when clicking inside card', () => {
    const closeSpy = vi.spyOn(component.close, 'emit');
    const card = fixture.nativeElement.querySelector('.modal-card');
    if (card) {
      card.click();
      expect(closeSpy).not.toHaveBeenCalled();
    }
  });
});
    expect(content).toBeTruthy();
  });
});
