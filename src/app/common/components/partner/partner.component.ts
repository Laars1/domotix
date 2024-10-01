/* eslint-disable no-unused-vars */
import { Component, OnInit } from '@angular/core';
import { PartnersService } from '../../services/partners.service';
import { Partner } from '../../models/partner';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss'],
  imports: [CommonModule, CardComponent, TranslateModule],
})
export class PartnerComponent implements OnInit {
  entries: Partner[] = []

  constructor(private partnerService: PartnersService) { }

  ngOnInit() {
    this.entries = this.partnerService.get();
  }

  getDetail(id: number){
    const entry = this.entries.find(x => x.id == id);
    if(entry != null){
      window.open(entry.url, '_blank')
    }
  }
}
