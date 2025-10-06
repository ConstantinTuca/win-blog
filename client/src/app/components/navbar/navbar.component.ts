import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit  } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CountryLanguageSettingsComponent } from '../language-settings/language-settings.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    TranslateModule,
    CountryLanguageSettingsComponent
  ],
  templateUrl: './navbar.component.html'
})

export class NavbarComponent implements OnInit, AfterViewInit {
  @Input() childMessage? : string
  @Input() navLight? : boolean = false
  @Input() tagline:boolean | undefined

  constructor() {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
  ngAfterViewInit() {
    this.activateMenu();
  }

  status: boolean = false;
  toggleMenu(){
    this.status = !this.status;
  }

  windowScroll() {
    const navbar = document.getElementById('topnav') as HTMLInputElement;
    if (document.body.scrollTop >= 50 || document.documentElement.scrollTop > 50) {
      navbar.classList.add('nav-sticky');
    } else {
      navbar.classList.remove('nav-sticky');
    }

    var mybutton = document.getElementById("back-to-top");
    if (mybutton != null) {
      if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        mybutton.classList.add("block");
        mybutton.classList.remove("hidden");
      } else {
        mybutton.classList.add("hidden");
        mybutton.classList.remove("block");
      }
    }
  }

  activateMenu() {
    var menuItems = document.getElementsByClassName("sub-menu-item") as any;
    if (menuItems) {

      var matchingMenuItem = null;
      for (var idx = 0; idx < menuItems.length; idx++) {
        if (menuItems[idx].href === window.location.href) {
          matchingMenuItem = menuItems[idx];
        }
      }

      if (matchingMenuItem) {
        matchingMenuItem.classList.add('active');
        var immediateParent = this.getClosest(matchingMenuItem, 'li');

        if (immediateParent) {
          immediateParent.classList.add('active');
        }

        var parent = this.getClosest(immediateParent, '.child-menu-item');
        if (parent) {
          parent.classList.add('active');
        }
        var parent = this.getClosest(parent || immediateParent, '.parent-menu-item');

        if (parent) {
          parent.classList.add('active');

          var parentMenuitem = parent.querySelector('.menu-item');
          if (parentMenuitem) {
            parentMenuitem.classList.add('active');
          }

          var parentOfParent = this.getClosest(parent, '.parent-parent-menu-item');
          if (parentOfParent) {
            parentOfParent.classList.add('active');
          }
        } else {
          var parentOfParent = this.getClosest(matchingMenuItem, '.parent-parent-menu-item');
          if (parentOfParent) {
            parentOfParent.classList.add('active');
          }
        }
      }
    }
  }

  getClosest(elem: any, selector: any) {
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.matches(selector)) return elem;
    }
    return null;
  };
}