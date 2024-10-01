/* eslint-disable no-unused-vars */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReferenceCardComponent } from './reference-card/reference-card.component';
import { ReferencesService } from '../../services/references.service';
import { Reference } from '../../models/reference';

@Component({
  selector: 'app-references',
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, ReferenceCardComponent]
})
export class ReferencesComponent implements OnInit {
  entries: Reference[] = []
  
  constructor(private referenceService: ReferencesService) { }

  ngOnInit(): void {
    this.entries = this.referenceService.getReferences();
  }
}
