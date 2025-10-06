import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgClickOutsideDirective } from 'ng-click-outside2';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  standalone: true,
  selector: 'app-language-settings',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NgSelectModule,
    NgClickOutsideDirective
  ],
  templateUrl: './language-settings.component.html',
  styleUrl: './language-settings.component.scss'
})

export class CountryLanguageSettingsComponent {
  // flag to handle the state of the menu (open or closed)
  languageMenu: boolean = false;

  savedLang: string | null = null;
  languages = [{name: 'Romanian', short: 'ro'}, {name: 'English', short: 'en'}];

  constructor(private toastr: ToastrService, private translate: TranslateService) {
    //language
    this.savedLang = localStorage.getItem('lang') || navigator.language.split('-')[0] || 'en';
    translate.setDefaultLang('en');
    translate.use(this.savedLang);
  }

  ngOnInit(): void {
  }

  switchLang(lang: {name: string, short: string, flag: string}) {
    this.translate.use(lang.short);
    localStorage.setItem('lang', lang.short);
    this.savedLang = lang.short;
  }

  onClickedOutside() {
    if(this.languageMenu) {
      this.languageMenu = false;
    }
  }
}