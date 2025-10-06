import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterLink,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss'
})
export class FaqsComponent {
  faqDataBuy = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 }
  ];

  faqDataGeneral = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 }
  ];

  faqDataSupport = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 }
  ];

  constructor() {}

  activeIndex:number = 1;
  toggleBox(id:number) {
    this.activeIndex = id;
  }

  activeIndex2:number = 1;
  toggleBox2(id:number) {
    this.activeIndex2 = id;
  }

  activeIndex3:number = 1;
  toggleBox3(id:number) {
    this.activeIndex3 = id;
  }
}
