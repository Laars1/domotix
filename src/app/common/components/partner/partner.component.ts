import { Component, Input, OnInit, inject } from '@angular/core';
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
  /** Page key; only brands whose `pages` in partners.json include it are shown. */
  @Input({ required: true }) page!: string;

  /**
   * Opens a dark closing element: rounded on top, at the inset of the About
   * block, continued below by a dark CTA band and an inset footer.
   */
  @Input() dark = false;

  entries: Partner[] = [];

  private partnerService = inject(PartnersService);

  ngOnInit() {
    this.entries = this.partnerService.get().filter(partner => partner.pages.includes(this.page));
  }
}
