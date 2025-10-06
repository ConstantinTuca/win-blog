import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { NgxSpinnerService } from 'ngx-spinner';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';

interface Winner {
  full_name: string;
  prize: string;
  date: string;
  image: string;
  confesion: string;
}

@Component({
  selector: 'app-past-winners',
  imports: [
    CommonModule,
    NavbarComponent
  ],
  templateUrl: './past-winners.component.html',
})
export class PastWinnersComponent implements OnInit {
  winners: Winner[] = [];
  loading = true;

  // Counter variables
  targetDate: Date = new Date();
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;

  private intervalId: any;

  constructor (
    private toast: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    // Example: next draw = 15 days from now
    this.targetDate.setDate(this.targetDate.getDate() + 15);
    this.startCountdown();

    this.loadWinners();
  }

  loadWinners() {
    this.spinner.show();
    this.loading = true;
    axios.get(`/api/winner/findAll`).then(({ data }) => {
      this.winners = data;

      this.loading = false;
      this.spinner.hide();
    }).catch(() => {
      this.toast.error('Error at the finding the winners');
      this.loading = false;
      this.spinner.hide();
    });
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

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
