import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService  } from '@ngx-translate/core';
import { LoginService } from '../services/login.service';
import { StripeService, StripeCardComponent, NgxStripeModule } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions} from '@stripe/stripe-js';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    TranslateModule,
    RouterLink,
    NgxStripeModule,
    StripeCardComponent
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})

export class SignupComponent implements OnInit {
  accept_terms: boolean = false;
  email: string = ''; password: string = ''; password_confirm: string = ''; errorMessage: string = '';
  errors: any = {};

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  constructor(
    private loginService: LoginService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
  }

  private validation():boolean {
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
    if (!this.password_confirm) {
      this.errors.password_confirm = true;
      isValid = false;
    }
    if (this.password && this.password_confirm && this.password != this.password_confirm) {
      this.errors.password_match = true;
      isValid = false;
    }
    if (!this.accept_terms) {
      this.errors.accept_terms = true;
      isValid = false;
    }

    return isValid;
  }

  handleSubmit = () => {
    if(this.validation()) {
      let ob = this.getSaveData();
      ob.role = 'client';
      this.loginService.signupClient(ob).then((resp: any) => {
        if (resp.success) {
          this.returnToHome('Contul a fost înregistrat cu success');
          console.log('Contul a fost creat cu success');
        } else {
          this.toastr.error(resp.errorMessage);
          console.log('Eroare la crearea contului');
        }
      });
    }
  };

  returnToHome = (message: any) => {
    this.toastr.success(message);
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);
  }

  getSaveData = () => {
    return {
      email: this.email,
      password: this.password,
      role: '',
      active: true
    } as any;
  }
}
