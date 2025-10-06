import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateModule, TranslateService  } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminSidebarComponent } from '../components/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from '../components/admin-topbar/admin-topbar.component';
import { AdminFooterComponent } from '../components/admin-footer/admin-footer.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ErrorModalComponent } from './error-modal/error-modal.component';

@Component({
  selector: 'app-errors',
  standalone: true,
  imports: [
    CommonModule,
    AdminSidebarComponent,
    AdminTopbarComponent,
    AdminFooterComponent,
    TranslateModule
  ],
  templateUrl: './errors.component.html',
  styleUrl: './errors.component.scss'
})
export class ErrorsComponent {
  activeSidebar:boolean = true;
  errors = [] as any;

  constructor (
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private modalService: NgbModal
  ) {};

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.spinner.show();
    axios.post(`/api/errors/findAll`, {}).then(( { data } ) => {
      this.errors = data.errors;
      this.spinner.hide();
    }).catch(() => this.toastr.error(this.translate.instant('ADMIN_ERRORS.MSG_ERR')));
  }

  toggleClass() {
    this.activeSidebar = !this.activeSidebar;
  }

  viewError = (row: any): void => {
    const modalRef = this.modalService.open(ErrorModalComponent, { size: 'xl', keyboard: false, backdrop: 'static' });
    modalRef.componentInstance.err_id = row.id;
  }

  remove(err : any) {
    const modalRef = this.modalService.open(ConfirmDialogComponent, { size: 'lg', keyboard: false, backdrop: 'static' });
    modalRef.componentInstance.title = this.translate.instant('ADMIN_ERRORS.MODAL_DELETE.TITLE');
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>${this.translate.instant('ADMIN_ERRORS.MODAL_DELETE.SUBTITLE')}`;
    modalRef.componentInstance.confirmButtonText = this.translate.instant('ADMIN_ERRORS.MODAL_DELETE.YES');
    modalRef.componentInstance.closeButtonText = this.translate.instant('ADMIN_ERRORS.MODAL_DELETE.NO');
    modalRef.closed.subscribe(() => {
      axios.post(`/api/errors/delete/${err.id}`, {id: err.id}).then(() => {
        this.toastr.success(this.translate.instant('ADMIN_ERRORS.MODAL_DELETE.MSG_SUCCESS'));
        this.loadData();
      }).catch(() => this.toastr.error(this.translate.instant('ADMIN_ERRORS.MODAL_DELETE.MSG_ERR')));
    });
  }
}
