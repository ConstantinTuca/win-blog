import axios from 'axios';
import { Component, EventEmitter, Output  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgClickOutsideDirective } from 'ng-click-outside2';
import { LoginService } from '../../../common/authentication/services/login.service';
import { getImagePath } from '../../../common/utils/utils';
import { ProfileImageService } from '../../../common/services/profile-image.service';
import { CountryLanguageSettingsComponent } from '../../../components/language-settings/language-settings.component';
import { TranslateModule  } from '@ngx-translate/core';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    NgClickOutsideDirective,
    RouterLink,
    CountryLanguageSettingsComponent,
    TranslateModule
  ],
  templateUrl: './topbar.component.html'
})
export class TopbarComponent {
  user = {} as any;
  userDetails = {} as any;

  @Output() toggleClass = new EventEmitter<void>();
  toastr: any;

  constructor(
    private _loginService: LoginService,
    private _router: Router,
    private _profileImageService: ProfileImageService
  ) { }

  ngOnInit() {
    this._loginService.userValue.pipe().subscribe(u => this.user = u);

    const profileImage = this._profileImageService.getImageUrl();
    if(!profileImage) {
      this.getProfileImage();
    } else {
      this.userDetails.profile_img_path = profileImage;
    }
  }

  getProfileImage():void {
    axios.get(`/api/client/${this.user.id}`).then(({ data }) => {
      this.userDetails = data;
      if (this.userDetails.profile_pic) {
        this.userDetails.profile_pic.file_blob = data.file_blob;
        this._profileImageService.setImageBlob(this.userDetails.profile_pic);

        this.userDetails.profile_img_path = getImagePath(this.userDetails.profile_pic);
      } else {
        this.userDetails.profile_img_path = "/assets/images/client/07.jpg";
      }
    }).catch(e => console.log(e));
  }

  emitToggleClassEvent() {
    this.toggleClass.emit();
  }

  userMenu:boolean = false;
  userDropdown(){
    this.userMenu = !this.userMenu;
  }

  onClickedOutside(e: Event) {
    this.userMenu = false;
  }

  logout = () => {
    this._router.navigateByUrl('/login').then(() => {
      if (window.location.pathname === '/login') {
        this._loginService.setValue();
      }
    });
  };
}
