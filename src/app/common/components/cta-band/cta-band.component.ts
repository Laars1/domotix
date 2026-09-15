import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Closing call-to-action band: a hairline, one line of text and a projected
 * action. Deliberately without a section-label — it reads as a closing note to
 * the section above rather than as a section of its own.
 *
 * The action is projected rather than configured, so the same band can carry a
 * router link on one page and a mailto on another without growing inputs.
 */
@Component({
  selector: 'app-cta-band',
  templateUrl: './cta-band.component.html',
  styleUrls: ['./cta-band.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class CtaBandComponent {
  /** Translation key for the body line. */
  @Input({ required: true }) text!: string;

  /**
   * Draw the hairline above the text. Set to false where the preceding section
   * already ends in a rule of its own — the services grid closes with the
   * bottom border of its last tile row, and two lines with a gap between them
   * read as a mistake.
   */
  @Input() divider = true;
}
