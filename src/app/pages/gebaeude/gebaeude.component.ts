import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LanguageProviderService } from '../../common/services/languageProvider.service';
import { NavigationComponent } from '../../common/components/navigation/navigation.component';
import { FooterComponent } from '../../common/components/footer/footer.component';
import { ServicesComponent, ServiceTile } from '../../common/components/services/services.component';
import { CtaBandComponent } from '../../common/components/cta-band/cta-band.component';
import { PageHeroComponent } from '../../common/components/page-hero/page-hero.component';
import { PartnerComponent } from '../../common/components/partner/partner.component';
import { SeoService, SITE_URL } from '../../common/services/seo.service';

/**
 * Building automation page: hero, an intro, the services along a vertical
 * line, and a dark closing element with the partner brands, the references
 * teaser and the footer.
 */
@Component({
  selector: 'app-gebaeude',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    NavigationComponent,
    FooterComponent,
    PageHeroComponent,
    ServicesComponent,
    PartnerComponent,
    CtaBandComponent,
  ],
  templateUrl: './gebaeude.component.html',
  styleUrl: './gebaeude.component.scss',
})
export class GebaeudeComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private langProvider = inject(LanguageProviderService);
  private translate = inject(TranslateService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private seo = inject(SeoService);
  private paramSub?: Subscription;

  lang = 'de';

  readonly services: ServiceTile[] = [
    { key: 'light',      icon: 'bi-lamp'             },
    { key: 'heating',    icon: 'bi-thermometer-half' },
    { key: 'shutter',    icon: 'bi-rocket-takeoff'   },
    { key: 'multimedia', icon: 'bi-cassette'         },
    { key: 'energy',     icon: 'bi-lightning-charge' },
    { key: 'security',   icon: 'bi-shield'           },
  ];

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const routeLang = params.get('lang') || 'de';
      if (!this.langProvider.getSupportedLanguages().includes(routeLang)) {
        this.router.navigate(['/gebaeude', 'de']);
        return;
      }
      this.lang = routeLang;
      this.langProvider.useLanguage(routeLang);
      this.seo.setCanonical(`/gebaeude/${this.lang}`);
      this.seo.setHreflangs(this.langProvider.getSupportedLanguages(), l => `/gebaeude/${l}`);
      this.updateMeta();
    });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
    this.seo.clearHreflangs();
  }

  private updateMeta(): void {
    this.translate.get(['building.pageTitle', 'building.metaDescription']).subscribe(t => {
      const title = `${t['building.pageTitle']} – Domotix GmbH`;
      const description = t['building.metaDescription'];
      const url = `${SITE_URL}/gebaeude/${this.lang}`;
      this.titleService.setTitle(title);
      this.metaService.updateTag({ name: 'description', content: description });
      this.metaService.updateTag({ property: 'og:title', content: title });
      this.metaService.updateTag({ property: 'og:description', content: description });
      this.metaService.updateTag({ property: 'og:url', content: url });
      this.metaService.updateTag({ property: 'og:type', content: 'website' });
      this.metaService.updateTag({ property: 'og:image', content: `${SITE_URL}/assets/images/Building/Hero/hero-1.webp` });
      this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.metaService.updateTag({ name: 'twitter:title', content: title });
      this.metaService.updateTag({ name: 'twitter:description', content: description });
      this.metaService.updateTag({ name: 'twitter:image', content: `${SITE_URL}/assets/images/Building/Hero/hero-1.webp` });
    });
  }
}
