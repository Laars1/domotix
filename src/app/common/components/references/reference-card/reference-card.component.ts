/* eslint-disable no-unused-vars */
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { Reference } from '../../../models/reference';
import { ReferenceModalComponent } from '../reference-modal/reference-modal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reference-card',
  templateUrl: './reference-card.component.html',
  styleUrls: ['./reference-card.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ReferenceCardComponent implements OnDestroy {
  @Input() entry!: Reference
  private modalReference: NgbModalRef | undefined;

  constructor(private modalService: NgbModal) { }

  ngOnDestroy(): void {
    this.modalService.dismissAll()
  }

  getDetail(){
    if(this.modalReference){
      this.modalReference.dismiss()
    }

    this.modalReference = this.modalService.open(ReferenceModalComponent, {centered: true, size: 'xl', modalDialogClass: 'reference-modal'})
    this.modalReference.componentInstance.entry = this.entry
  }
}
