import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService  } from '@ngx-translate/core';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
   imports: [
    FormsModule,
    TranslateModule
  ],
  standalone: true
})
export class ErrorModalComponent implements OnInit {
  @Input() err_id: any;
  modal = {} as any;

  constructor(public activeModal: NgbActiveModal, private toastr: ToastrService, private translate: TranslateService,) {}

  ngOnInit() {
    axios.get(`/api/errors/find/${this.err_id}`).then(({ data }) => {
      this.modal = data;
    }).catch(() => this.toastr.error(this.translate.instant('ADMIN_ERRORS.MSG_ERR')));
  }
}
