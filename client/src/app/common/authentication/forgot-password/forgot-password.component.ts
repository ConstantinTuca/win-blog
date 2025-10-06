import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService} from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../services/login.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {
  email: string = ''; errorMessage: string = '';
  errors: any = {};
  user: any = {};

  constructor(
    private loginService: LoginService,
    private translate: TranslateService,
    private toast: ToastrService
  ) {
    this.loginService.userValue.pipe().subscribe(u => this.user = u);
  }

  ngOnInit(): void {
  }

  private validation(): boolean {
    const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

    let isValid = true;
    this.errors = {};
    this.errorMessage = '';

    if (!this.email) {
      this.errors.email = true;
      isValid = false;
    }
    if (this.email && !regexEmail.test(this.email)) {
      this.errors.emailInvalid = true;
      isValid = false;
    }
    return isValid;
  };

  handleSubmit = () => {
    if (this.validation()) {
      this.loginService.getUserByEmail(this.email).then(data => {
        if (data.errorMessage) {
          this.errorMessage = data.errorMessage;
        } else {
          this.loginService.sendEmailResetPassword(data.user, this.email).then(d => {
            if(d.errorMessage) {
              this.errorMessage = d.errorMessage;
            } else {
              this.toast.success(this.translate.instant('FORGOT_PASSWORD.MSG_ERR.SAVE_SUCCESS'));
              setTimeout(() => {
                window.location.pathname = '/';
              }, 1500);
            }
          });
        }
      });
    }
  };
}