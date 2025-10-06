import { Component } from '@angular/core';

@Component({
  selector: 'app-switcher',
  standalone: true,
  imports: [],
  templateUrl: './switcher.component.html',
  styleUrl: './switcher.component.scss'
})
export class SwitcherComponent {
  ngOnInit() {
    const lightDarkMode = sessionStorage.getItem('lightDarkMode');
    if(lightDarkMode) {
      const htmlTag = document.documentElement;
      htmlTag.className = 'scroll-smooth ' + lightDarkMode;
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  changeMode() {
    const htmlTag = document.documentElement;
    if (htmlTag.className.includes("dark")) {
      htmlTag.className = 'light'
      sessionStorage.setItem('lightDarkMode', 'light');
    } else {
      htmlTag.className = 'dark'
      sessionStorage.setItem('lightDarkMode', 'dark');
    }
    htmlTag.className += ' scroll-smooth';
  }
}
