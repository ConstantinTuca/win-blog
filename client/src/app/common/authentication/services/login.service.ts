import axios from 'axios';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileImageService } from '../../services/profile-image.service';
import { TranslateService } from '@ngx-translate/core';

// import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private userSubject = new BehaviorSubject<any>(0);

  constructor(
    private spinner: NgxSpinnerService,
    private profileImageService: ProfileImageService,
    private translate: TranslateService
    // private toastr: ToastrService
  ) {
    this.userSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('currentUser')!));
  };

  public get userValue(): Observable<any> {
    return this.userSubject.asObservable();
  }

  public setValue(user?: any) {
    if (user) {
      user.name_text = this.getNameText(user);

      if (user.loginFlag) {
        user.loggedInTime = new Date().getTime();
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.userSubject.next(user);
      } else {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.userSubject.next(user);
      }
    } else {
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('profileImage');
      this.userSubject.next({});
      this.profileImageService.setImageBlob(null);
    }
  }

  public getNameText = (user: any):string => {
    let name_text = '';
    user.first_name && (name_text = user.first_name);
    if(user.last_name) {
      name_text.length && (name_text += ' ');
      name_text += user.last_name;
    }
    return name_text.length ? name_text : 'User';
  }

  async login(email: string, password: string) {
    this.spinner.show();
    try {
      const { data } = await axios.post('/api/login', { email, password });
      this.spinner.hide();
      if (!data.success && !data.token) {
        return { errorMessage: data.message };
      } else {
        return data;
      }
    } catch (e) {
      return { errorMessage: 'Eroare la autentificare' };
      // return this.toastr.error('Eroare autentificare!');
    }
  }

  async signupClient(user: any) {
    this.spinner.show();
    try {
      const { data } = await axios.post('/api/clientGuests', user);
      this.spinner.hide();
      if (data.id) {
        return { success: true }
      } else {
        if (data.usedToken) {
          return { success: false, errorMessage: 'Această persoană are deja un cont' };
        } else if (data.usedEmail) {
          return { success: false, errorMessage: 'Emailul a fost deja folosit de un alt cont', id_existing_user: data.id_existing_user };
        } else {
          return { success: false, errorMessage: 'Eroare la crearea contului' };
        }
      }
    } catch (e) {
      return { success: false, errorMessage: 'Eroare la înregistrare' };
    }
  }

  /** Part for RESET PASSWORD */
  async getUserByEmail(email: string) {
    this.spinner.show();
    try {
      const { data } = await axios.post('/api/checkUserByEmail', { email });
      this.spinner.hide();
      if (!data.found) {
        return { errorMessage: this.translate.instant('LOGIN_SERVICE.GET_USER_BY_EMAIL.NO_USER'), user: null as any };
      } else {
        return { errorMessage: null, user: data.user as any };
      }
    } catch (e) {
      this.spinner.hide();
      return { errorMessage: this.translate.instant('LOGIN_SERVICE.GET_USER_BY_EMAIL.CHECK'), user: null as any };
    }
  }

  async getIdUserByResetToken(token: string) {
    this.spinner.show();
    try {
      const { data } = await axios.post('/api/checkIdUserByResetToken', { token });
      this.spinner.hide();
      if (!data.found) {
        return { errorMessage: this.translate.instant('LOGIN_SERVICE.GET_ID_USER_BY_RESET_TOKEN.NO_USER'), id_user: null as number | null };
      } else {
        return { errorMessage: null, id_user: data.id_user as number | null };
      }
    } catch (e) {
      this.spinner.hide();
      return { errorMessage: this.translate.instant('LOGIN_SERVICE.GET_ID_USER_BY_RESET_TOKEN.ERR'), id_user: null as number | null };
    }
  }

  async sendEmailResetPassword(user: any, email: string) {
    this.spinner.show();
    try {
      const { } = await axios.post('/api/sendEmailResetPassword', { user, email });
      this.spinner.hide();
      return { errorMessage: null };
    } catch (e) {
      this.spinner.hide();
      return { errorMessage: this.translate.instant('LOGIN_SERVICE.SEND_EMAIL_RESET_PASS.ERR') };
    }
  }

  async resetPassword(id_user: any, password: string) {
    this.spinner.show();
    try {
      const { data } = await axios.post('/api/resetPassword', { id_user, password });
      this.spinner.hide();
      if (!data.success) {
        return { errorMessage: data.message };
      } else {
        return { errorMessage: null };
      }
    } catch (e) {
      return { errorMessage: this.translate.instant('LOGIN_SERVICE.RESET_PASSWORD.ERR') };
    }
  }

  /** Part for VALIDATE EMAIL */
  async getIdUserByValidationToken(token: string) {
    this.spinner.show();
    try {
      const { data } = await axios.post('/api/checkIdUserByValidationToken', { token });
      this.spinner.hide();
      if (!data.found) {
        return { errorMessage: this.translate.instant('LOGIN_SERVICE.GET_ID_USER_BY_VALIDATION_TOKEN.NO_USER'), id_user: null as number | null };
      } else {
        return { errorMessage: null, id_user: data.id_user as number | null };
      }
    } catch (e) {
      this.spinner.hide();
      return { errorMessage: this.translate.instant('LOGIN_SERVICE.GET_ID_USER_BY_VALIDATION_TOKEN.ERR'), id_user: null as number | null };
    }
  }

  async sendEmailValidation(user: any, email: string) {
    this.spinner.show();
    try {
      await axios.post('/api/sendEmailValidation', { user, email });
      this.spinner.hide();
      return { errorMessage: null };
    } catch (e) {
      this.spinner.hide();
      return { errorMessage: this.translate.instant('LOGIN_SERVICE.SEND_EMAIL_VALIDATION.ERR') };
    }
  }

  async validateEmail(id_user: any) {
    this.spinner.show();
    try {
      const { data } = await axios.post('/api/validateEmail', { id_user });
      this.spinner.hide();
      if (!data.success) {
        return { errorMessage: data.message };
      } else {
        return { errorMessage: null };
      }
    } catch (e) {
      return { errorMessage: this.translate.instant('LOGIN_SERVICE.VALIDATE_EMAIL.ERR') };
    }
  }
};
