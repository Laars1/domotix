import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { NavigationComponent } from '../../common/components/navigation/navigation.component';
import { ParallaxWrapperComponent } from '../../common/components/parallax-wrapper/parallax-wrapper.component';
import { HomeComponent } from '../../common/components/home/home.component';
import { VisionComponent } from '../../common/components/vision/vision.component';
import { ServicesComponent } from '../../common/components/services/services.component';
import { AboutComponent } from '../../common/components/about/about.component';
import { ReferencesComponent } from '../../common/components/references/references.component';
import { PartnerComponent } from '../../common/components/partner/partner.component';
import { FooterComponent } from '../../common/components/footer/footer.component';
import { ContainerComponent } from '../../common/components/container/container.component';
import { LanguageProviderService } from '../../common/services/languageProvider.service';
import { SeoService, SITE_URL } from '../../common/services/seo.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    TranslateModule,
    ParallaxWrapperComponent,
    NavigationComponent,
    HomeComponent,
    VisionComponent,
    ServicesComponent,
    AboutComponent,
    ReferencesComponent,
    PartnerComponent,
    FooterComponent,
    ContainerComponent,
  ],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit, OnDestroy {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private translate = inject(TranslateService);
  private langProvider = inject(LanguageProviderService);
  private seo = inject(SeoService);
  private langSub?: Subscription;

  ngOnInit(): void {
    this.seo.setCanonical('/');
    this.seo.setJsonLd('ld-organization', {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Domotix GmbH',
      url: SITE_URL,
      logo: `${SITE_URL}/assets/images/logo.svg`,
      image: `${SITE_URL}/assets/images/hero-1.webp`,
      telephone: '+41315125005',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Muesmattstrasse 37',
        postalCode: '3012',
        addressLocality: 'Bern',
        addressCountry: 'CH',
      },
      areaServed: ['Bern', 'Solothurn', 'Schweiz'],
    });
    this.langSub = this.langProvider.language$.subscribe(() => this.updateMeta());
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.seo.removeJsonLd('ld-organization');
  }

  private updateMeta(): void {
    this.translate.get(['meta.title', 'meta.description']).subscribe(t => {
      const title = t['meta.title'];
      const description = t['meta.description'];
      this.titleService.setTitle(title);
      this.metaService.updateTag({ name: 'description', content: description });
      this.metaService.updateTag({ property: 'og:title', content: title });
      this.metaService.updateTag({ property: 'og:description', content: description });
      this.metaService.updateTag({ property: 'og:url', content: SITE_URL });
      this.metaService.updateTag({ property: 'og:type', content: 'website' });
      this.metaService.updateTag({ property: 'og:image', content: `${SITE_URL}/assets/images/hero-1.webp` });
      this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.metaService.updateTag({ name: 'twitter:title', content: title });
      this.metaService.updateTag({ name: 'twitter:description', content: description });
      this.metaService.updateTag({ name: 'twitter:image', content: `${SITE_URL}/assets/images/hero-1.webp` });
    });
  }
}
