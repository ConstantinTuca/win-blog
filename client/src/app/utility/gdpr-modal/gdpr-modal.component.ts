import { Component, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-gdpr-modal',
  templateUrl: './gdpr-modal.component.html',
  styleUrl: './gdpr-modal.component.scss',
  imports: [
    TranslateModule
  ]
})
export class GdprModalComponent {

  constructor(public activeModal: NgbActiveModal) { }

  save() {
    localStorage.setItem('gdpr-compliance', 'true');
    this.activeModal.dismiss();
  }

  @HostListener('window:keydown.control.shift.q')
  closeModal() {
    this.activeModal.dismiss();
  }
}
