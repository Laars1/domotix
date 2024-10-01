/* eslint-disable no-unused-vars */
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReferencesService } from '../../services/references.service';
import { Reference } from '../../models/reference';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ReferenceModalComponent } from './reference-modal/reference-modal.component';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-references',
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, CardComponent]
})
export class ReferencesComponent implements OnInit, OnDestroy {
  entries: Reference[] = []
  private modalReference: NgbModalRef | undefined;
  
  constructor(private referenceService: ReferencesService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.entries = this.referenceService.get();
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll()
  }

  getDetail(id: number){
    console.log(this.entries.find(x => x.id == id))
    if(this.modalReference){
      this.modalReference.dismiss()
    }

    this.modalReference = this.modalService.open(ReferenceModalComponent, {centered: true, size: 'xl', modalDialogClass: 'reference-modal'})
    this.modalReference.componentInstance.entry = this.entries.find(x => x.id == id)
  }
}
