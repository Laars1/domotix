import { AfterViewInit, Component, ElementRef, NgZone, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LanguageProviderService } from '../../common/services/languageProvider.service';
import { NavigationComponent } from '../../common/components/navigation/navigation.component';
import { FooterComponent } from '../../common/components/footer/footer.component';
import { PageHeroComponent } from '../../common/components/page-hero/page-hero.component';
import { ClosingCard, ServicesComponent, ServiceTile } from '../../common/components/services/services.component';
import { SeoService, SITE_URL } from '../../common/services/seo.service';
import { CONFIGURATION_CONSTANT } from '../../shared/constants/configuration.constants';

/** Where the hero card settles: just below the 64px navigation, one stack step above the first value card. */
const HERO_CARD_TOP = 68;
/** Scroll distance, as a share of the viewport height, over which the hero narrows into a card. */
const HERO_COLLAPSE = 0.45;
/** Matches the value cards, which shrink by this share once covered. */
const COVERED_SHRINK = 0.05;

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

/**
 * Experience page: the hero narrows into the bottom card of a stack as the page
 * scrolls, the three value cards slide over it, and a contact card lands last.
 */
@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [
    TranslateModule,
    NavigationComponent,
    FooterComponent,
    PageHeroComponent,
    ServicesComponent,
  ],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent implements OnInit, AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private langProvider = inject(LanguageProviderService);
  private translate = inject(TranslateService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private seo = inject(SeoService);
  private host = inject(ElementRef<HTMLElement>);
  private zone = inject(NgZone);
  private paramSub?: Subscription;
  private frame: number | undefined;
  private resizeObserver: ResizeObserver | undefined;

  lang = 'de';
  readonly email: string = CONFIGURATION_CONSTANT.email;

  readonly values: ServiceTile[] = [
    { key: 'experience.values.discovery',    icon: 'bi-compass'        },
    { key: 'experience.values.independence', icon: 'bi-signpost-split' },
    { key: 'experience.values.honesty',      icon: 'bi-patch-check'    },
  ];

  readonly contact: ClosingCard = {
    text: 'experience.contact.text',
    cta: 'experience.contact.cta',
    href: `mailto:${this.email}`,
  };

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const routeLang = params.get('lang') || 'de';
      if (!this.langProvider.getSupportedLanguages().includes(routeLang)) {
        this.router.navigate(['/experience', 'de']);
        return;
      }
      this.lang = routeLang;
      this.langProvider.useLanguage(routeLang);
      this.seo.setCanonical(`/experience/${this.lang}`);
      this.seo.setHreflangs(this.langProvider.getSupportedLanguages(), l => `/experience/${l}`);
      this.updateMeta();
    });
  }

  ngAfterViewInit(): void {
    // Scroll-linked and style-only, so it runs outside Angular
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll, { passive: true });
      // The card size depends on text that loads after the first render
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(this.onScroll);
        const deck = (this.host.nativeElement as HTMLElement).querySelector('.experience-deck');
        if (deck) {
          this.resizeObserver.observe(deck);
        }
      }
    });
    this.collapseHero();
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
    this.seo.clearHreflangs();
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
        this.collapseHero();
      });
    }
  };

  /**
   * Shrinks the pinned hero from full size into the bottom card of the stack:
   * scaled until it is as wide as the value cards, its top at HERO_CARD_TOP,
   * anything taller than the first card trimmed off the bottom. Once settled,
   * it shrinks and dims a little more as the first value card slides over it,
   * like the cards above it. When the deck lets go it leaves with the first
   * value card, the one lying directly on it.
   */
  private collapseHero(): void {
    const root = this.host.nativeElement as HTMLElement;
    const hero = root.querySelector<HTMLElement>('app-page-hero');
    const cards = root.querySelector<HTMLElement>('.services-cards');
    const first = cards?.querySelector<HTMLElement>('.service-card');
    if (!hero || !cards || !first) {
      return;
    }
    // The host is pinned but never transformed, so its rect is the layout box
    const box = hero.getBoundingClientRect();
    const frame = cards.getBoundingClientRect();
    const cardHeight = first.offsetHeight;
    const radius = parseFloat(getComputedStyle(first).borderTopLeftRadius) || 0;

    const cardScale = frame.width / box.width;
    const crop = Math.max(0, box.height - cardHeight / cardScale);

    const t = clamp(window.scrollY / (window.innerHeight * HERO_COLLAPSE));
    const eased = t * t * (3 - 2 * t);
    const firstTop = first.getBoundingClientRect().top;
    const firstPinnedTop = parseFloat(getComputedStyle(first).top) || 0;
    const settledTop = Math.min(HERO_CARD_TOP, HERO_CARD_TOP + firstTop - firstPinnedTop);

    const baseScale = 1 + eased * (cardScale - 1);
    const clipBottom = eased * crop;
    const top = box.top + eased * (settledTop - box.top);
    const visibleHeight = (box.height - clipBottom) * baseScale;
    const covered = clamp((top + visibleHeight - firstTop) / visibleHeight);
    const scale = baseScale * (1 - covered * COVERED_SHRINK);
    const centre = frame.left + frame.width / 2;

    hero.style.setProperty('--hero-x', `${centre - (box.width * scale) / 2 - box.left}px`);
    hero.style.setProperty('--hero-y', `${top - box.top}px`);
    hero.style.setProperty('--hero-scale', scale.toFixed(4));
    hero.style.setProperty('--clip-bottom', `${clipBottom}px`);
    hero.style.setProperty('--clip-radius', `${(eased * radius) / baseScale}px`);
    hero.style.setProperty('--dim', (covered * 0.6).toFixed(3));
  }



  private updateMeta(): void {
    this.translate.get(['experience.pageTitle', 'experience.metaDescription']).subscribe(t => {
      const title = `${t['experience.pageTitle']} – Domotix GmbH`;
      const description = t['experience.metaDescription'];
      const url = `${SITE_URL}/experience/${this.lang}`;
      this.titleService.setTitle(title);
      this.metaService.updateTag({ name: 'description', content: description });
      this.metaService.updateTag({ property: 'og:title', content: title });
      this.metaService.updateTag({ property: 'og:description', content: description });
      this.metaService.updateTag({ property: 'og:url', content: url });
      this.metaService.updateTag({ property: 'og:type', content: 'website' });
      this.metaService.updateTag({ property: 'og:image', content: `${SITE_URL}/assets/images/Experience/Hero/hero-1.webp` });
      this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.metaService.updateTag({ name: 'twitter:title', content: title });
      this.metaService.updateTag({ name: 'twitter:description', content: description });
      this.metaService.updateTag({ name: 'twitter:image', content: `${SITE_URL}/assets/images/Experience/Hero/hero-1.webp` });
    });
  }
}
