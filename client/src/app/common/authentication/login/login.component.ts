import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule} from '@ngx-translate/core';
import { updateTokenLogin } from '../../utils/utils';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, TranslateModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
  email: string = ''; password: string = ''; errorMessage: string = '';
  errors: any = {};
  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
  }

  private validation(): boolean {
    let isValid = true;
    let regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
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
    if (!this.password) {
      this.errors.password = true;
      isValid = false;
    }
    return isValid;
  };

  handleSubmit = () => {
    if (this.validation()) {
      this.loginService.login(this.email, this.password).then(resp => {
        if (resp.errorMessage) {
          this.errorMessage = resp.errorMessage;
        } else {
          this.makeLogin(resp);
          console.log('Succes in autentificarea noului utilizator');
        }
      });
    }
  }

  makeLogin = (data: any) => {
    let returnUrl = '';
    if (data.role === "sa") {
      returnUrl = '/admin';
    } else {
      returnUrl = '/blog';
    }

    updateTokenLogin(data, returnUrl, this.router, this.loginService);
  }
}