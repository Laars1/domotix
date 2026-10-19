import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ParallaxWrapperComponent } from '../parallax-wrapper/parallax-wrapper.component';

/**
 * Hero for the content pages: the same image slider as the home page, a bit
 * shorter, with the page title set into the picture as its h1.
 */
@Component({
  selector: 'app-page-hero',
  templateUrl: './page-hero.component.html',
  styleUrls: ['./page-hero.component.scss'],
  standalone: true,
  imports: [NgIf, TranslateModule, ParallaxWrapperComponent],
})
export class PageHeroComponent {
  /** Translation key of the page title. */
  @Input({ required: true }) title!: string;
  /** Landscape images; several cross-fade like on the home page. */
  @Input({ required: true }) imgSrcs: string[] = [];
  /** Portrait counterparts, matched by index. */
  @Input() imgSrcsMobile: string[] = [];

  /**
   * The page pins the hero and shrinks it into a card while scrolling (see the
   * experience page). Picture and title scale together, driven by properties
   * the page sets on the host: --hero-x/--hero-y/--hero-scale place it,
   * --clip-bottom/--clip-radius trim it to the card, --dim darkens it. The
   * navigation goes solid as soon as the page scrolls instead of waiting for
   * the hero to leave.
   */
  @Input() pinned = false;
}
