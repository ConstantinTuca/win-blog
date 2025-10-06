import axios from 'axios';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService  } from '@ngx-translate/core';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { TopbarComponent } from '../components/topbar/topbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { LoginService } from '../../common/authentication/services/login.service';
import { FileUploadService } from '../../common/services/file-upload.service';
import { getImagePath } from '../../common/utils/utils';
import { SocketService } from '../../common/services/socket.service';

@Component({
  selector: 'app-profile-setting',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './profile-setting.component.html',
  styleUrl: './profile-setting.component.scss'
})
export class ProfileSettingComponent {
  user = {} as any;
  userDetails = {} as any;
  activeSidebar:boolean = true;
  required = {} as any;
  files: Array<{ file: File }> = [];

  toggleClass() {
    this.activeSidebar = !this.activeSidebar;
  }

  constructor (
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private router: Router,
    private fileUpload: FileUploadService,
    private translate: TranslateService,
    private socketService: SocketService
  ) {
    this.loginService.userValue.pipe().subscribe(u => this.user = u);
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.spinner.show();
    axios.get(`/api/client/${this.user.id}`).then(({ data }) => {
      this.userDetails = data;
      this.userDetails.full_name = (this.userDetails.last_name ? this.userDetails.last_name : '') + ' ' + (this.userDetails.first_name ? this.userDetails.first_name : '');
      if (this.userDetails.profile_pic) {
        this.userDetails.profile_pic.file_blob = data.file_blob;
        this.userDetails.profile_pic = getImagePath(this.userDetails.profile_pic);
      } else {
        this.userDetails.profile_pic = "/assets/images/client/07.jpg";
      }
      this.spinner.hide();
    }).catch(() => this.toastr.error(this.translate.instant('PROFILE_SETTING.MSG_ERR.ERROR')));
  }

  handleFileInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.files = [];
    if (target.files && target.files[0]) {
      this.files.push({file: target.files[0]});
       // Generate preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.userDetails.profile_pic = e.target.result;
        };
        reader.readAsDataURL(target.files[0]);
    }

    if (this.files.length) {
      let filesToUpload = [];
      for(let ob of this.files) {
        filesToUpload.push(ob.file);
      }

      if (filesToUpload) {
        this.spinner.show();
        this.fileUpload.saveFiles(filesToUpload, {}, '/api/client/setImageProfile', (error: any) => {
          if (error) {
            this.toastr.error(this.translate.instant('PROFILE_SETTING.IMAGE.ERROR'));
          } else {
            this.toastr.success(this.translate.instant('PROFILE_SETTING.IMAGE.SUCCESS'));
          }
          this.spinner.hide();
        });
      }
    }
  }

  private validate(): boolean {
    if (!this.userDetails.first_name) {
      this.toastr.error(this.translate.instant('PROFILE_SETTING.MSG_ERR.FIRST_NAME'));
      this.required.first_name = true;
      return false;
    }

    if (!this.userDetails.last_name) {
      this.toastr.error(this.translate.instant('PROFILE_SETTING.MSG_ERR.LAST_NAME'));
      this.required.last_name = true;
      return false;
    }

    if (!this.userDetails.email) {
      this.toastr.error(this.translate.instant('PROFILE_SETTING.MSG_ERR.EMAIL'));
      this.required.email = true;
      return false;
    }
    return true;
  }

  save() {
    if (this.validate()) {
      this.spinner.show();
      axios.put('/api/client', this.userDetails).then(() => {
        this.socketService?.get()?.emit('pageReload', { type: 'user', id: this.user.id });
        this.loadData();
        this.spinner.hide();
        this.toastr.success(this.translate.instant('PROFILE_SETTING.MSG_ERR.SUCCESS'))
      }).catch(() => this.translate.instant('PROFILE_SETTING.MSG_ERR.ERROR'));
    }
  }

  validatePassword = () => {
    if (!this.userDetails.old_password || !this.userDetails.old_password.length) {
      this.toastr.error(this.translate.instant('PROFILE_SETTING.MSG_ERR.OLD'));
      this.required.old_password = true;
      return false;
    }

    if (!this.userDetails.new_password || !this.userDetails.new_password.length) {
      this.toastr.error(this.translate.instant('PROFILE_SETTING.MSG_ERR.NEW'));
      this.required.new_password = true;
      return false;
    }

    if (this.userDetails.new_password === this.userDetails.old_password) {
      this.toastr.error(this.translate.instant('PROFILE_SETTING.MSG_ERR.NEW_OLD'));
      this.required.new_password = true;
      return false;
    }

    if (this.userDetails.new_password !== this.userDetails.retype_password) {
      this.required.retype_password = true;
      this.toastr.error(this.translate.instant('PROFILE_SETTING.MSG_ERR.RETYPE'));
      return false;
    }
    return true;
  }

  handleSubmit(): void {
    if (this.validatePassword()) {
      this.spinner.show();
      axios.post(`/api/client/verifyOldPassword`, {id: this.userDetails.id, password: this.userDetails.old_password }).then((r: any) => {
        if(r.data.valid) {
          this.makeSave();
        } else {
          this.toastr.error(this.translate.instant('PROFILE_SETTING.MSG_ERR.OLD_MATCH'));
          this.spinner.hide();
        }
      }).catch(() => this.toastr.error(this.translate.instant('PROFILE_SETTING.MSG_ERR.ERR_PASS')));
    }
  }

  makeSave(): void {
    this.spinner.show();
    axios.post(`/api/client/reset/password`, {id: this.userDetails.id, password: this.userDetails.new_password }).then(() => {
      this.spinner.hide();
      this.logout();
      this.toastr.success(this.translate.instant('PROFILE_SETTING.MSG_ERR.SUCCES_PASS'));
    }).catch(() => this.toastr.error(this.translate.instant('PROFILE_SETTING.MSG_ERR.ERR_PASS')));
  }

  validateEmail = () => {
    this.loginService.sendEmailValidation(this.user, this.user.email).then((data: any) => {
      if (data.errorMessage) {
        this.toastr.error(data.errorMessage);
      } else {
        this.toastr.success(this.translate.instant('PROFILE_SETTING.VALIDATE_EMAIL.MSG_SUCCESS'));
      }
    });
  }

  delete(): void {
    const modalRef = this.modalService.open(ConfirmDialogComponent, { size: 'lg', keyboard: false, backdrop: 'static' });
    modalRef.componentInstance.title = this.translate.instant('PROFILE_SETTING.MODAL_DELETE.TITLE');
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>${this.translate.instant('PROFILE_SETTING.MODAL_DELETE.SUBTITLE')}?`;
    modalRef.componentInstance.confirmButtonText = this.translate.instant('PROFILE_SETTING.MODAL_DELETE.YES');
    modalRef.componentInstance.closeButtonText = this.translate.instant('PROFILE_SETTING.MODAL_DELETE.NO');
    modalRef.closed.subscribe(() => {
      this.spinner.show();
      axios.delete(`/api/client/${this.userDetails.id}`).then(() => {
        this.logout();
        this.toastr.success(this.translate.instant('PROFILE_SETTING.MODAL_DELETE.MSG_SUCCESS'));
        this.spinner.hide();
      }).catch(() => this.toastr.error(this.translate.instant('PROFILE_SETTING.ERROR')));
    })
  }

  logout = () => {
    this.router.navigateByUrl('/login').then(() => {
      if (window.location.pathname === '/login') {
        this.loginService.setValue();
      }
    });
  };
}
