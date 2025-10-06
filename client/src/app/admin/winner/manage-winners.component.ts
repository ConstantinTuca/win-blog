import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminSidebarComponent } from '../components/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from '../components/admin-topbar/admin-topbar.component';
import { AdminFooterComponent } from '../components/admin-footer/admin-footer.component';

interface Winner {
  id: number;
  full_name: string;
  confesion: string;
  date: string;
  prize: number;
  paid: boolean;
  created_at: string;
}

@Component({
  selector: 'app-manage-winners',
  imports: [
    AdminSidebarComponent,
    AdminTopbarComponent,
    AdminFooterComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './manage-winners.component.html'
})
export class ManageWinnersComponent implements OnInit {
  activeSidebar: boolean = true;
  winners: Winner[] = [];
  filteredWinners: Winner[] = [];
  searchTerm = '';
  selectedStatus = 'all';
  loading = true;

  constructor(
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  toggleClass() {
    this.activeSidebar = !this.activeSidebar;
  }

  ngOnInit(): void {
    this.loadWinners();
  }

  loadWinners() {
    this.spinner.show();
    this.loading = true;
    axios.get(`/api/admin/winner/findAll`).then(({ data }) => {
      this.winners = data;
      this.filteredWinners = data;

      this.loading = false;
      this.spinner.hide();
    }).catch(() => {
      this.toast.error('Error at the finding the winners');
      this.loading = false;
      this.spinner.hide();
    });
  }

  filterWinners() {
    this.filteredWinners = this.winners.filter(winner => {
      const matchesSearch = winner.full_name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'all' || (winner.paid && this.selectedStatus === 'paid');
      return matchesSearch && matchesStatus;
    });
  }

  editWinner(winnerId: number) {
    this.router.navigate(['/admin/edit-winner', winnerId]);
  }

  changeStatus(winner: Winner) {
    winner.paid = !winner.paid;

    const updateObject = {
      id: winner.id,
      paid: winner.paid
    };
    this.spinner.show();
    axios.put(`/api/admin/winner`, updateObject).then(() => {
      this.toast.success('The winner was changed status with success');
      this.spinner.hide();
    }).catch(() => this.toast.error('Error at the changing of status of the winner'));
  }

  deleteWinner(winnerId: number) {
    if (!confirm('Are you sure you want to delete this winner?')) return;

    axios.delete(`/api/admin/winner/${winnerId}`).then(() => {
      this.toast.success('The winner was deleted with success');
      this.spinner.hide();
      this.loadWinners();
    }).catch(() => this.toast.error('Error at the deleting of the winner'));
  }
}
