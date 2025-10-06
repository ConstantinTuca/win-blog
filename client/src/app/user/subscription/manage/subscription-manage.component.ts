import axios from 'axios';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LoginService } from '../../../common/authentication/services/login.service';

interface Subscription {
  id: number;
  plan: string;
  price: number;
  currency: string;
  status: 'Active' | 'Canceled' | 'Past_due' | 'Incomplete';
  current_period_end: string;
  last_payment?: string;
}

interface BillingRecord {
  date: string;
  amount: number;
  currency: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

@Component({
  selector: 'app-subscription-manage',
  imports: [
    CommonModule,
    SidebarComponent,
    TopbarComponent,
    FooterComponent
  ],
  templateUrl: './subscription-manage.component.html'
})
export class SubscriptionManageComponent implements OnInit {
  subscription: Subscription | null = null;
  billingHistory: BillingRecord[] = [];
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

        this.billingHistory = data.invoices;
      }
      this.loading = false;
      this.spinner.hide();
    }).catch(() => {
      this.toast.error('Error at the finding the subscription');
      this.loading = false;
      this.spinner.hide();
    });
  }

  onUpdatePayment() {
    if(this.subscription) {
      console.log('Redirect to Stripe customer portal...');

      // this.spinner.show();
      // axios.post(`/api/admin/subscription/manage`, { id: this.subscription.id }).then((data) => {
      //   window.location.href = data.url; // redirect to Stripe portal
      // }).catch(() => this.toast.error(`Error at the updating the payment method!`));
    }
  }

  onCancel() {
    if(this.subscription) {
      console.log('Cancel subscription via backend:', this.subscription.id);

      // this.spinner.show();
      // axios.post(`/api/admin/subscription/portal`, { id: this.subscription.id, id_user: this.user.id }).then(() => {
      //   this.toast.success(`The subscription was canceled with succes!`);
      //   this.spinner.hide();
      //   this.loadSubscriptionData();
      // }).catch(() => this.toast.error(`Error at the canceling the subscription!`));
    }
  }
}
