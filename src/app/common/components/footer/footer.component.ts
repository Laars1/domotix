/* eslint-disable no-unused-vars */
import { Component, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PoliciesModalComponent } from './policies-modal/policies-modal.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true
})
export class FooterComponent implements OnDestroy{
  private modalReference: NgbModalRef | undefined;

  constructor(private modalService: NgbModal) { }

  ngOnDestroy(): void {
    this.modalService.dismissAll()
  }

  getModal(){
    if(this.modalReference){
      this.modalReference.dismiss()
    }

    this.modalReference = this.modalService.open(PoliciesModalComponent, {centered: true, size: 'xl'})
  }
}
