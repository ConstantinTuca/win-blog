import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService} from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterLink
  ],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  password: string = ''; password_confirm: string = '';
  reset_token: string = ''; errorMessage: string = '';
  errors: any = {};
  user: any = {};
  id_user: any;

  constructor(
    private route: ActivatedRoute,
    private loginService: LoginService,
    private translate: TranslateService,
    private toast: ToastrService
  ) {
    this.loginService.userValue.pipe().subscribe(u => this.user = u);
  }

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('reset_token');
    if(token) {
      this.reset_token = token;
      this.checkCode();
    }
  }

  private validation(): boolean {
    let isValid = true;
    this.errors = {};
    if (!this.id_user) {
        this.toast.error(this.translate.instant('RESET_PASSWORD.MSG_ERR.NO_USER_ERROR'));
        isValid = false;
    }
    if (!this.password) {
      this.errors.password = true;
      isValid = false;
    }
    if (!this.password_confirm) {
      this.errors.password_confirm = true;
      isValid = false;
    }
    if(this.password && this.password_confirm && this.password != this.password_confirm) {
      this.errors.password_match = true;
      isValid = false;
    }

    return isValid;
  };

  handleSubmit = () => {
    if (this.validation()) {
      this.loginService.resetPassword(this.id_user, this.password).then(data => {
        if (data.errorMessage) {
          this.errorMessage = data.errorMessage;
        } else {
          this.toast.success(this.translate.instant('RESET_PASSWORD.MSG_ERR.SAVE_SUCCESS'));
          setTimeout(()=>{
            window.location.pathname = '/login';
          }, 1500);
        }
      });
    } else {
      this.toast.error(this.translate.instant('RESET_PASSWORD.MSG_ERR.VALIDATION_ERROR'));
    }
  };

  checkCode() {
    if (this.reset_token) {
      this.loginService.getIdUserByResetToken(this.reset_token).then(data => {
        if (data.errorMessage) {
          this.errorMessage = data.errorMessage;
        } else {
          this.id_user = data.id_user;
        }
      });
    }
  };
}