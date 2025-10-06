import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LoginService } from '../../common/authentication/services/login.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  user = {} as any;
  contact_form = {
    name: null as string | null,
    email: null as string | null,
    subject: null as string | null,
    message: null as string | null,
  };
  required = {} as any;

  constructor(
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
    private modalService: NgbModal,
    private loginService: LoginService,
    private translate: TranslateService
  ) {
    this.loginService.userValue.pipe().subscribe(u => this.user = u);
  }

  validate = (): boolean => {
    const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

    if (!this.contact_form.name) {
      this.toast.error(this.translate.instant('CONTACT.MSG_ERR.NAME'));
      this.required.name = true;
      return false;
    }
    if (!this.contact_form.email) {
      this.toast.error(this.translate.instant('CONTACT.MSG_ERR.EMAIL'));
      this.required.email = true;
      return false;
    }
    if (this.contact_form.email && !regexEmail.test(this.contact_form.email)) {
      this.toast.error(this.translate.instant('CONTACT.MSG_ERR.EMAIL_INCORRECT'));
      this.required.email_incorect = true;
      return false;
    }
    if (!this.contact_form.subject) {
      this.toast.error(this.translate.instant('CONTACT.MSG_ERR.SUBJECT'));
      this.required.subject = true;
      return false;
    }
    if (!this.contact_form.message) {
      this.toast.error(this.translate.instant('CONTACT.MSG_ERR.MESSAGE'));
      this.required.message = true;
      return false;
    }
    return true;
  }

  save = () => {
    if(this.validate()) {
      const modalRef = this.modalService.open(ConfirmDialogComponent, { size: 'lg', keyboard: false, backdrop: 'static' });
      modalRef.componentInstance.title = this.translate.instant('CONTACT.MSG_ERR.MODAL_TITLE_SAVE');
      modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>${this.translate.instant('CONTACT.MSG_ERR.MODAL_CONTENT_SAVE')}`;
      modalRef.componentInstance.confirmButtonText = this.translate.instant('CONTACT.MSG_ERR.MODAL_YES');
      modalRef.componentInstance.closeButtonText = this.translate.instant('CONTACT.MSG_ERR.MODAL_NO');
      modalRef.closed.subscribe(() => {
        this.spinner.show();
        axios.post(`/api/emailSender/contact`, this.contact_form).then(() => {
          this.spinner.hide();
          this.toast.success(this.translate.instant('CONTACT.MSG_ERR.SEND_SUCCESS'));
        }).catch(() => {
          this.spinner.hide();
          this.toast.error(this.translate.instant('CONTACT.MSG_ERR.SEND_ERROR'));
        });
      })
    }
  }
}
