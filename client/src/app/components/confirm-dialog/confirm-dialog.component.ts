import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  imports: [CommonModule]
})
export class ConfirmDialogComponent {
  @Input() title: any;
  @Input() content: any;
  @Input() confirmButtonText?: string = 'Yes';
  @Input() confirmButtonColor?: string = 'green';
  @Input() closeButtonText?: string = 'No';
  @Input() exitButtonText?: string = 'Exit';
  @Input() hideConfirmBtn!: boolean;
  @Input() showExitButton!: boolean;

  constructor(public activeModal: NgbActiveModal) {}

  ngAfterViewInit() {
    if (this.showExitButton && this.hideConfirmBtn) {
      const exitButton = document.getElementById('exit-button');
      const closeButton = document.getElementById('close-button');
      if (!exitButton || !closeButton) return;

      const buttonWidth = Math.max(exitButton.offsetWidth, closeButton.offsetWidth);
      exitButton.style.display = 'inline-block';
      closeButton.style.display = 'inline-block';
      exitButton.style.width = buttonWidth + 'px';
      closeButton.style.width = buttonWidth + 'px';
    }
  }
}
