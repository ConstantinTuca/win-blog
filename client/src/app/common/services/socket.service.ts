import axios from 'axios';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { LoginService } from '../authentication/services/login.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket?: Socket;
  private options: Partial<ManagerOptions & SocketOptions> = {
    transports: ['websocket', 'polling']
  };
  private user: any = {};
  private _userValue: any;

  constructor(
    private toastr: ToastrService,
    private loginService: LoginService,
    private translate: TranslateService
  ) {
    this._userValue = this.loginService.userValue.subscribe(u => this.user = u);
  }

  connect() {
    this.socket = environment.production ? io(this.options) : io('ws://localhost:2020', this.options);
    this.socket.on('pageReload', this.handlePageReload);
  };

  get() {
    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
  }

  private handlePageReload = (ob: any): void => {
    if(ob) {
      axios.post(`/api/checkUserDetails`, {id: ob.id}).then(({ data }) => {
        this.doPageReload(ob, data);
      }).catch(e => {
        this.doPageReload(ob);
      });
    } else {
      this.doPageReload(ob);
    }
  };

  private doPageReload = (ob: any, newUser?: any): boolean => {
    if (ob.type === 'all' || (ob.type === 'user' && ob.id === this.user.id)) {
      let time = 5000;
      let t = time / 1000;
      this.setToast(t);
      setInterval(() => {
        t -= 1;
        this.toastr.clear();
        this.setToast(t);
      }, 1000);
      setTimeout(() => {
        if(newUser) {
          const updatedUser = {...this.user, ...newUser};
          this.loginService.setValue(updatedUser)
        }
        window.location.reload();
      }, time);
    }
    return true;
  }

  private setToast = (t: number): void => {
    if (t) {
      this.toastr.info(this.translate.instant('SOCKET_SERVICE.HANDLE_PAGE_RELOAD.REFRESH') + t + this.translate.instant('SOCKET_SERVICE.HANDLE_PAGE_RELOAD.REFRESH_END'));
    }
  };

  ngOnDestroy() {
    this._userValue.unsubscribe();
  }
}
