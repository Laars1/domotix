import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PartnersService } from '../../services/partners.service';
import { Partner } from '../../models/partner';

@Component({
  standalone: true,
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss'],
  imports: [CommonModule, TranslateModule],
})
export class PartnerComponent implements OnInit {
  entries: Partner[] = [];

  constructor(private partnerService: PartnersService) {}

  ngOnInit() {
    this.entries = this.partnerService.get();
  }
}
