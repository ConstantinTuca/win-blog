import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminSidebarComponent } from '../components/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from '../components/admin-topbar/admin-topbar.component';
import { AdminFooterComponent } from '../components/admin-footer/admin-footer.component';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

interface AdminSubscription {
  id: number;
  id_user: number;
  name: string;
  email: string;
  plan: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  current_period_end: string;
  last_payment?: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
}

@Component({
  selector: 'app-admin-subscriptions',
  imports: [
    CommonModule,
    FormsModule,
    AdminSidebarComponent,
    AdminTopbarComponent,
    AdminFooterComponent
  ],
  templateUrl: './admin-subscriptions.component.html',
})
export class AdminSubscriptionsComponent implements OnInit {
  subscriptions: AdminSubscription[] = []; filteredSubsciptions: AdminSubscription[] = [];
  activeSidebar: boolean = true;
  searchTerm = '';
  selectedStatus = 'all';
  loading = true;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) {}

  toggleClass() {
    this.activeSidebar = !this.activeSidebar;
  }

  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.spinner.show();
    this.loading = true;
    axios.get(`/api/admin/subscription/findAll`).then(({ data }) => {
      this.subscriptions = data.sort((a: {id: number}, b: {id: number}) => a.id - b.id);
      this.filteredSubsciptions = data;

      this.loading = false;
      this.spinner.hide();
    }).catch(() => {
      this.toast.error('Error at the finding of the subscriptions');
      this.loading = false;
      this.spinner.hide();
    });
  }

  filterSubscriptions() {
    this.filteredSubsciptions = this.subscriptions.filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'all' || (this.selectedStatus === sub.status);
      return matchesSearch && matchesStatus;
    });
  }

  viewSubscription(id: number) {
     this.router.navigate(['/admin/admin-subscription-detail', id]);
  }

  onCancel(subscription: AdminSubscription) {
    console.log('Cancel subscription via backend:', subscription.stripe_subscription_id);

    // this.spinner.show();
    // axios.post(`/api/admin/subscription/cancel`, { id: subscription.id }).then(() => {
    //   this.toast.success(`The subscription was canceled with succes!`);
    //   this.spinner.hide();
    //   this.loadSubscriptions();
    // }).catch(() => this.toast.error(`Error at the canceling the subscription!`));
  }

  onRefund(subscription: AdminSubscription) {
    console.log('Refund last payment via backend:', subscription.stripe_customer_id);

    // this.spinner.show();
    // axios.post(`/api/admin/subscription/refund`, { id: subscription.id }).then(() => {
    //   this.toast.success(`The subscription was refunded with succes!`);
    //   this.spinner.hide();
    //   this.loadSubscriptions();
    // }).catch(() => this.toast.error(`Error at the refunding the subscription!`));
  }
}
