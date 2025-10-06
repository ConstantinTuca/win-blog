import axios from 'axios';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SwitcherComponent } from './components/switcher/switcher.component';
import { SocketService } from './common/services/socket.service';
import { GdprModalComponent } from './utility/gdpr-modal/gdpr-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatDialogModule,
    SwitcherComponent,
    NgxSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {

  constructor(
    private translate: TranslateService,
    private socketService: SocketService,
    private modalService: NgbModal
  ) {
    const savedLang = localStorage.getItem('lang') || navigator.language.split('-')[0] || 'en';
    translate.setDefaultLang('en');
    translate.use(savedLang);

    this.socketService.connect();
  }

  ngOnInit() {
    const gdprComplicance = localStorage.getItem('gdpr-compliance');
    if (!gdprComplicance || gdprComplicance != 'true') {
      this.checkGDPR();
    }
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  checkGDPR = () => {
    this.modalService.open(GdprModalComponent, { size: 'xl', keyboard: false, backdrop: 'static' });
  };
}