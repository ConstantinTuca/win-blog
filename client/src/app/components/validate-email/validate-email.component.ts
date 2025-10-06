import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from '../../common/authentication/services/login.service';
import { SocketService } from '../../common/services/socket.service';

@Component({
  standalone: true,
  selector: 'app-validate-email',
  imports: [
    TranslateModule,
    RouterLink
  ],
  templateUrl: './validate-email.component.html'
})
export class ValidateEmailComponent {
  private validationToken: string = '';
  private idUser: any;
  loading: boolean = true; success: boolean = true; errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private loginService: LoginService,
    private socketService: SocketService
  ) {
    this.loginService.setValue();
  }

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('validation_token');
    if(token) {
      this.validationToken = token;
      this.checkCode();
    }
  }

  private checkCode(): void {
    if(this.validationToken) {
      this.loginService.getIdUserByValidationToken(this.validationToken).then((data: any) => {
        if(data.errorMessage) {
          this.errorMessage = data.errorMessage;
          this.success = false;
          this.loading = false;
        }
        else {
          this.idUser = data.id_user;
          this.success = true;
          this.validate();
        }
      });
    }
  }

  private validate(): void {
    this.loginService.validateEmail(this.idUser).then((data: any) => {
      this.loading = false;

      if(data.errorMessage) {
        this.errorMessage = data.errorMessage;
        this.success = false;
      }
      else {
        this.socketService?.get()?.emit('pageReload', { type: 'user', id: this.idUser });
        this.success = true;
        setTimeout(() => {
          window.location.pathname = '/';
        }, 5000);
      }
    });
  }
}
