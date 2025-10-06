import axios from "axios";
import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { LoginService } from '../services/login.service'

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  user = {} as any;
  isFirstRun = true;

  constructor(private router: Router, private loginService: LoginService) {}

  refreshToken(): Promise<void> {
    return new Promise((res, rej) => {
      this.loginService.userValue.pipe().subscribe(u => this.user = u);
      if (this.user) {
        let time = new Date().getTime() - this.user.loggedInTime;
        const hours20 = 72000000;

        if (time >= hours20) {
          axios.get('/api/refreshToken').then(resp => {
            this.loginService.setValue({ ...this.user, loggedInTime: new Date().getTime(), token: resp.data.token });
            res();
          }).catch(() => {
            rej();
          });
        } else {
          res();
        }
      } else {
        rej();
      }
    });
  }

  canActivate = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> => {
    return this.refreshToken().then(() => {
      const routeRoles: string[] = route.data['roles'];

      if (this.user && this.user.active) {
        axios.defaults.headers.common['x-access-token'] = this.user.token;

        if(routeRoles.length) {
          for (let role of routeRoles) {
            if (role === this.user.role) {
              return true;
            }
          }
        } else {
          return true;
        }
      }

      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }, () => {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      });
      this.loginService.setValue();
      return false;
    });
  };
};
