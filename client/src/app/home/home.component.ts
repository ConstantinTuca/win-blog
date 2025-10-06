import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';


Swiper.use([Pagination]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    FormsModule,
    RouterLink
  ],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  email: string = '';

  // Countdown timer state
  targetDate: Date = new Date();
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;

  private intervalId: any;

  ngOnInit() {
    // Example: next draw = 15 days from now
    this.targetDate.setDate(this.targetDate.getDate() + 15);
    this.startCountdown();
  }

  ngAfterViewInit(): void {
    new Swiper('.features-swiper', {
      modules: [Pagination],
      loop: true,
      pagination: { el: '.features-swiper .swiper-pagination', clickable: true },
    });

    new Swiper('.testimonials-swiper', {
      modules: [Pagination],
      loop: true,
      pagination: { el: '.testimonials-swiper .swiper-pagination', clickable: true },
    });

    new Swiper('.winners-swiper', {
      modules: [Pagination],
      loop: true,
      pagination: { el: '.winners-swiper .swiper-pagination', clickable: true },
    });

    new Swiper('.pricing-swiper', {
      modules: [Pagination],
      loop: true,
      pagination: { el: '.pricing-swiper .swiper-pagination', clickable: true },
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  startCountdown() {
    this.intervalId = setInterval(() => {
      const now = new Date().getTime();
      const distance = this.targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(this.intervalId);
        this.days = this.hours = this.minutes = this.seconds = 0;
        return;
      }

      this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    }, 1000);
  }

  subscribe() {
    console.log('Subscribed with email:', this.email);
    alert(`Subscribed with email: ${this.email}`);
  }
}
