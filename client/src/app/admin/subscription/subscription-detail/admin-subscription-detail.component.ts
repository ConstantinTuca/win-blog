import axios from 'axios';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from '../../components/admin-topbar/admin-topbar.component';
import { AdminFooterComponent } from '../../components/admin-footer/admin-footer.component';
import { ToastrService } from 'ngx-toastr';

interface BillingRecord {
  date: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
}

interface SubscriptionDetail {
  id_user: number;
  name: string;
  email: string;
  plan: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  current_period_end: string;
  last_payment?: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  billing_history: BillingRecord[];
}

@Component({
  selector: 'app-admin-subscription-detail',
  imports: [
    CommonModule,
    AdminSidebarComponent,
    AdminTopbarComponent,
    AdminFooterComponent
  ],
  templateUrl: './admin-subscription-detail.component.html',
})
export class AdminSubscriptionDetailComponent implements OnInit {
  subscription: SubscriptionDetail | null = null;
  activeSidebar: boolean = true;
  loading = true;

  subscriptionId!: number;

  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) {}

  toggleClass() {
    this.activeSidebar = !this.activeSidebar;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.subscriptionId = +id;
        this.loadSubscriptionData(this.subscriptionId);
      }
    });
  }

  loadSubscriptionData(id: number) {
    this.spinner.show();
    axios.get(`/api/admin/subscription/find/${id}`).then(({ data }) => {
      this.subscription = data;

      if(this.subscription) {
        this.subscription.billing_history = [
            { date: '2025-09-11', amount: 5, currency: 'EUR', status: 'paid' },
            { date: '2025-08-11', amount: 5, currency: 'EUR', status: 'paid' },
          ];
      }
      this.loading = false;
      this.spinner.hide();
    }).catch(() => {
      this.toast.error('Error at the finding the subscription');
      this.loading = false;
      this.spinner.hide();
    });
  }

  onCancel(subscription: SubscriptionDetail) {
    console.log('Cancel subscription via backend:', subscription.stripe_subscription_id);

    // this.spinner.show();
    // axios.post(`/api/admin/subscription/cancel`, { id: subscription.id }).then(() => {
    //   this.toast.success(`The subscription was canceled with succes!`);
    //   this.spinner.hide();
    //   this.loadSubscriptionData(this.subscriptionId);
    // }).catch(() => this.toast.error(`Error at the canceling the subscription!`));
  }

  onRefund(subscription: SubscriptionDetail) {
    console.log('Refund last payment via backend:', subscription.stripe_customer_id);

    // this.spinner.show();
    // axios.post(`/api/admin/subscription/refund`, { id: subscription.id }).then(() => {
    //   this.toast.success(`The subscription was refunded with succes!`);
    //   this.spinner.hide();
    //   this.loadSubscriptionData(this.subscriptionId);
    // }).catch(() => this.toast.error(`Error at the refunding the subscription!`));
  }
}
