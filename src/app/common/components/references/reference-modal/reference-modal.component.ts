/* eslint-disable no-unused-vars */
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Reference } from '../../../models/reference';
import { NgbActiveModal, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-reference-modal',
  templateUrl: './reference-modal.component.html',
  styleUrls: ['./reference-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, NgbCarouselModule, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReferenceModalComponent {
  @Input() entry!: Reference
  constructor(private activeModal: NgbActiveModal) { }

  dismiss(): void{
    this.activeModal.dismiss()
  }
}
