/* eslint-disable no-unused-vars */
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-policies-modal',
  templateUrl: './policies-modal.component.html',
  styleUrls: ['./policies-modal.component.scss'],
  standalone: true,
  imports: [TranslateModule]
})
export class PoliciesModalComponent {

  constructor(private activeModal: NgbActiveModal) { }

  dismiss(): void{
    this.activeModal.dismiss()
  }
}
