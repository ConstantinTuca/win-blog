import axios from 'axios';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from '../../components/admin-topbar/admin-topbar.component';
import { AdminFooterComponent } from '../../components/admin-footer/admin-footer.component';
import { LoginService } from '../../../common/authentication/services/login.service';

@Component({
  selector: 'app-add-winner',
  imports: [
    AdminSidebarComponent,
    AdminTopbarComponent,
    AdminFooterComponent,
    CommonModule,
    FormsModule,
    NgSelectModule
  ],
  templateUrl: './add-winner.component.html'
})
export class AddWinnerComponent {
  isEditMode = false;
  winnerId!: number;

  activeSidebar: boolean = true;
  flagSubmitted: boolean = false;
  user = {} as any;
  users = [] as any[];
  winner = {
    id: null as number | null,
    full_name: '',
    confesion: '',
    date: '',
    prize: 100 as number | null,
    id_user: null as number | null
  };

  constructor(
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private _loginService: LoginService,
  ) {
    this._loginService.userValue.pipe().subscribe(u => this.user = u);
  }

  ngOnInit(): void {
    // Check if we are editing
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.winnerId = +id;
        this.loadWinner();
      }
    });

    this.loadUsers();
  }

  loadWinner() {
    this.spinner.show();
    axios.get(`/api/admin/winner/find/${this.winnerId}`).then(({ data }) => {
      this.winner = {
        id: this.winnerId,
        full_name: data.full_name,
        confesion: data.confesion,
        date: data.date.split('T')[0], // format date
        prize: data.prize,
        id_user: data.id_user
      };
      this.spinner.hide();
    }).catch(() => {
      this.toast.error('Error at the finding the winner');
      this.spinner.hide();
    });
  }

  loadUsers() {
    this.spinner.show();
    axios.get(`/api/admin/winner/findUsers`).then(({ data }) => {
      this.users = data.sort((a: {id: number}, b: {id: number}) => a.id - b.id);
      this.spinner.hide();
    }).catch(() => {
      this.toast.error('Error at the finding the users');
      this.spinner.hide();
    });
  }

  toggleClass() {
    this.activeSidebar = !this.activeSidebar;
  }

  selectUser(item: any) {
    this.winner.full_name = item.full_name;
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [] as any;
    splitTerm.forEach(arr_term => {
      let searchId = item['id'].toString().toLowerCase();
      let searchName = item['full_name'].toLowerCase();
      isWordThere.push(searchId.indexOf(arr_term) != -1 || searchName.indexOf(arr_term) != -1);
    });
    const all_words = (this_word: any) => this_word;
    return isWordThere.every(all_words);
  }

  validation = () => {
    this.flagSubmitted = true;
    if(!this.winner.full_name) {
      this.toast.error('The full name of the winner is mandatory');
      return false;
    }
    if(!this.winner.confesion) {
      this.toast.error('The confesion of the winner is mandatory');
      return false;
    }
    if(!this.winner.date) {
      this.toast.error('The date of the winner is mandatory');
      return false;
    }
    if(!this.winner.prize) {
      this.toast.error('The prize of the winner is mandatory');
      return false;
    }
    if(!this.winner.id_user) {
      this.toast.error('The user of the winner is mandatory');
      return false;
    }
    return true;
  }

  save() {
    if(this.validation()) {
      this.spinner.show();

      if (this.isEditMode) {
        // only update
        axios.put(`/api/admin/winner`, this.winner).then(() => {
          this.toast.success(`The winner was updated with sucess!`);
          this.spinner.hide();
          this.router.navigate(['/admin/manage-winners']);
        }).catch(() => this.toast.error(`Error at the updating the winner!`));
      } else {
        //create a new blog winner
        axios.post(`/api/admin/winner`, this.winner).then(() => {
          this.toast.success(`The winner was posted with sucess!`);
          this.spinner.hide();
          this.router.navigate(['/admin/manage-winners']);
        }).catch(() => this.toast.error(`Error at the creating the winner!`));
      }
    }
  }
}
