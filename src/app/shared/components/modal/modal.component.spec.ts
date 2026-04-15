import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

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
    spyOn(component.close, 'emit');
    component.onClose();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit close event when close button is clicked', () => {
    spyOn(component.close, 'emit');
    const closeButton = fixture.nativeElement.querySelector('.modal-close');
    closeButton.click();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit close event when clicking on overlay', () => {
    spyOn(component.close, 'emit');
    const overlay = fixture.nativeElement.querySelector('.modal-overlay');
    overlay.click();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should not emit close event when clicking inside card', () => {
    spyOn(component.close, 'emit');
    const card = fixture.nativeElement.querySelector('.modal-card');
    card.click();
    expect(component.close.emit).not.toHaveBeenCalled();
  });

  it('should render ng-content inside modal-content', () => {
    const content = fixture.nativeElement.querySelector('.modal-content');
    expect(content).toBeTruthy();
  });
});
