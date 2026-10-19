import { AfterViewInit, Component, ElementRef, HostListener, Input, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/** One tile: `key` is the translation prefix for its title, tagline and modal text. */
export interface ServiceTile {
  key: string;
  icon: string;
}

/** Call to action shown as the last card of the stack (cards layout). */
export interface ClosingCard {
  /** Translation key of the line on the card. */
  text: string;
  /** Translation key of the button label. */
  cta: string;
  href: string;
}

/** Share of the viewport height at which the line counts as "drawn". */
const LINE_ANCHOR = 0.6;

/** Space kept below a card that is taller than the room under the navigation. */
const CARD_FIT_GAP = 16;

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  // One file per layout, so each stays within the component style budget
  styleUrls: ['./services.component.scss', './services-line.scss', './services-cards.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class ServicesComponent implements AfterViewInit, OnDestroy {
  private readonly zone = inject(NgZone);

  /** Translation key of the section label; empty for none. */
  @Input() label = 'services.label';

  /** Translation key of a centred intro paragraph above the tiles; empty for none. */
  @Input() intro = '';

  @Input({ required: true }) services!: ServiceTile[];

  /**
   * `grid`: tiles in rows of three. `line`: one below the other with the full
   * text, alternating left and right of a vertical line that fills in as the
   * page scrolls, the icon large on the other side.
   * `cards`: large cards with the full text that stack while scrolling, each
   * new one sliding over the one before.
   */
  @Input() layout: 'grid' | 'line' | 'cards' = 'grid';

  /** Cards layout only: a call to action that lands on top of the stack last. */
  @Input() closing: ClosingCard | null = null;

  @ViewChild('line') private line?: ElementRef<HTMLElement>;
  @ViewChild('cards') private cards?: ElementRef<HTMLElement>;

  activeService: ServiceTile | null = null;

  private frame: number | undefined;
  private resizeObserver: ResizeObserver | undefined;

  open(service: ServiceTile): void {
    this.activeService = service;
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.activeService = null;
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  ngAfterViewInit(): void {
    if (!this.line && !this.cards) {
      return;
    }
    // Scroll events fire constantly; line and cards only touch styles, never bindings.
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll, { passive: true });
      // Heights change after the first render (translations and fonts load
      // late), and the card fit depends on them, so re-measure on any change
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(this.onScroll);
        const root = (this.line ?? this.cards)!.nativeElement;
        this.resizeObserver.observe(root);
        root.querySelectorAll('.service-card').forEach(card => this.resizeObserver!.observe(card));
      }
    });
    this.update();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    this.resizeObserver?.disconnect();
    if (this.frame !== undefined) {
      cancelAnimationFrame(this.frame);
    }
  }

  private onScroll = (): void => {
    if (this.frame === undefined) {
      this.frame = requestAnimationFrame(() => {
        this.frame = undefined;
        this.update();
      });
    }
  };

  private update(): void {
    this.drawLine();
    this.stackCards();
  }

  /**
   * Fills the line down to the anchor height in the viewport and marks every
   * dot the fill has passed.
   */
  private drawLine(): void {
    const line = this.line?.nativeElement;
    if (!line) {
      return;
    }
    const anchor = window.innerHeight * LINE_ANCHOR;
    const track = line.querySelector<HTMLElement>('.services-line__track') ?? line;
    const rect = track.getBoundingClientRect();
    const progress = Math.min(Math.max((anchor - rect.top) / rect.height, 0), 1);
    line.style.setProperty('--line-progress', progress.toFixed(4));
    line.classList.toggle('is-complete', progress >= 0.999);
    line.querySelectorAll<HTMLElement>('.line-item').forEach(item => {
      const dot = item.querySelector('.line-item__dot');
      item.classList.toggle('is-reached', !!dot && dot.getBoundingClientRect().top <= anchor);
    });
  }

  /**
   * Sets two properties on every card:
   * --fit-shift lifts the pinned position of a card taller than the room below
   * the navigation, so it pins only once its bottom is in view and no text is
   * out of reach while it waits to be covered.
   * --covered (0–1) is how far the next card has slid over it; the stylesheet
   * dims covered cards with it, so the stack reads as a deck.
   * --shrink (0–1) scales a card down; it follows --covered, except on the last
   * card, which nothing covers: it shrinks while the finished stack holds, so
   * it ends up the size of the cards behind it, but stays fully legible.
   * Heights come from offsetHeight, which the scale leaves alone.
   */
  private stackCards(): void {
    const container = this.cards?.nativeElement;
    if (!container) {
      return;
    }
    this.fitTitles(container);
    const cards = Array.from(container.querySelectorAll<HTMLElement>('.service-card'));
    // The closing card has little text; at least as tall as the tallest card,
    // it covers the stack completely instead of letting text peek out below
    const closing = container.querySelector<HTMLElement>('.service-card--closing');
    if (closing) {
      const tallest = Math.max(...cards.filter(card => card !== closing).map(card => card.offsetHeight));
      closing.style.minHeight = `${tallest}px`;
    }
    cards.forEach((card, index) => {
      const currentShift = parseFloat(card.style.getPropertyValue('--fit-shift')) || 0;
      const preferredTop = parseFloat(getComputedStyle(card).top) + currentShift;
      const shift = Math.max(0, preferredTop + card.offsetHeight + CARD_FIT_GAP - window.innerHeight);
      card.style.setProperty('--fit-shift', `${Math.round(shift)}px`);

      const next = cards[index + 1];
      const bottom = card.getBoundingClientRect().top + card.offsetHeight;
      let covered = 0;
      let shrink: number;
      if (next) {
        covered = Math.min(Math.max((bottom - next.getBoundingClientRect().top) / card.offsetHeight, 0), 1);
        shrink = covered;
      } else {
        // The hold is the gap before the stack's empty last item: from landing
        // until release the container bottom closes in on the card bottom.
        // Done after 60% of it, so the even stack still holds for a moment.
        const hold = parseFloat(getComputedStyle(container).rowGap) || 1;
        const remaining = container.getBoundingClientRect().bottom - bottom;
        shrink = Math.min(Math.max((hold - remaining) / (hold * 0.6), 0), 1);
      }
      card.style.setProperty('--covered', covered.toFixed(3));
      card.style.setProperty('--shrink', shrink.toFixed(3));
    });
  }

  /**
   * Keeps every card title on one line and all of them the same size: sets
   * --title-fit (≤ 1) on the stack so the longest title just fits its column,
   * with a little air, and the others follow. Both widths come from client
   * rects, so the cards' own scale cancels out, and the factor does not depend
   * on its previous value, so it settles at once.
   */
  private fitTitles(container: HTMLElement): void {
    const current = parseFloat(container.style.getPropertyValue('--title-fit')) || 1;
    let fit = 1;
    container.querySelectorAll<HTMLElement>('.service-card__title').forEach(title => {
      const range = document.createRange();
      range.selectNodeContents(title);
      const textWidth = range.getBoundingClientRect().width;
      const boxWidth = title.getBoundingClientRect().width;
      if (textWidth && boxWidth) {
        fit = Math.min(fit, ((current * boxWidth) / textWidth) * 0.98);
      }
    });
    if (Math.abs(fit - current) > 0.005) {
      container.style.setProperty('--title-fit', fit.toFixed(3));
    }
  }

}
