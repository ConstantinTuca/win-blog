import axios from 'axios';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LoginService } from '../../../common/authentication/services/login.service';

interface Subscription {
  plan: string;
  price: number;
  currency: string;
  status: 'Active' | 'Canceled' | 'Past_due' | 'Incomplete';
  current_period_end: string;
  last_payment?: string;
}

@Component({
  selector: 'app-subscription-dashboard',
  imports: [
    CommonModule,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
  ],
  templateUrl: './subscription-dashboard.component.html',
})
export class SubscriptionDashboardComponent implements OnInit {
  subscription: Subscription | null = null;
  activeSidebar: boolean = true;
  loading = true;
  user = {} as any;

  toggleClass() {
    this.activeSidebar = !this.activeSidebar;
  }

  constructor (
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
    private toast: ToastrService,
    private router: Router
  ) {
    this.loginService.userValue.pipe().subscribe(u => this.user = u);
  };

  ngOnInit(): void {
    if(this.user) {
      this.loadSubscriptionData();
    }
  }

  loadSubscriptionData() {
    this.spinner.show();
    axios.get(`/api/client/subscription/find/${this.user.id}`).then(({ data }) => {
      this.subscription = data.subscription;

      if(this.subscription) {
        this.subscription.price = 5;
        this.subscription.currency = 'EUR';
      }
      this.loading = false;
      this.spinner.hide();
    }).catch(() => {
      this.toast.error('Error at the finding the subscription');
      this.loading = false;
      this.spinner.hide();
    });
  }

  onManage() {
    this.router.navigate(['/user/subscription-manage']);
  }

  onSubscribe() {
    if(this.user) {
      console.log('Redirect to Stripe customer portal...');

      this.spinner.show();
      axios.post(`/api/client/subscription/subscribe`, { id: this.user.id }).then(({ data }) => {
        window.location.href = data.url; // redirect to Stripe portal
      }).catch(() => this.toast.error(`Error at the subscribe action on Stripe!`));
    } else {
      this.toast.error('There is no user to subscribe');
    }
  }
}
