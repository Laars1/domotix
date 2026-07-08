import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ArtikelService } from '../../common/services/artikel.service';
import { LanguageProviderService } from '../../common/services/languageProvider.service';
import { Artikel } from '../../common/models/artikel';
import { NavigationComponent } from '../../common/components/navigation/navigation.component';
import { FooterComponent } from '../../common/components/footer/footer.component';
import { SeoService, SITE_URL } from '../../common/services/seo.service';

@Component({
  selector: 'app-artikel-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, NavigationComponent, FooterComponent],
  templateUrl: './artikel-list.component.html',
  styleUrl: './artikel-list.component.scss',
})
export class ArtikelListComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private artikelService = inject(ArtikelService);
  private langProvider = inject(LanguageProviderService);
  private translate = inject(TranslateService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private seo = inject(SeoService);
  private paramSub?: Subscription;

  artikel: Artikel[] = [];
  lang = 'de';

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const routeLang = params.get('lang') || 'de';
      if (!this.langProvider.getSupportedLanguages().includes(routeLang)) {
        this.router.navigate(['/artikel', 'de']);
        return;
      }
      this.lang = routeLang;
      this.langProvider.useLanguage(routeLang);
      this.seo.setCanonical(`/artikel/${this.lang}`);
      this.load();
    });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
  }

  private load(): void {
    this.translate.get(['artikel.pageTitle']).subscribe(t => {
      const title = `${t['artikel.pageTitle']} – Domotix GmbH`;
      const description = 'Fachwissen rund um Gebäudeautomation, Smart Home und Energieeffizienz – von den Experten der Domotix GmbH aus Bern.';
      const url = `${SITE_URL}/artikel/${this.lang}`;
      this.titleService.setTitle(title);
      this.metaService.updateTag({ name: 'description', content: description });
      this.metaService.updateTag({ property: 'og:title', content: title });
      this.metaService.updateTag({ property: 'og:description', content: description });
      this.metaService.updateTag({ property: 'og:url', content: url });
      this.metaService.updateTag({ property: 'og:type', content: 'website' });
      this.metaService.updateTag({ property: 'og:image', content: `${SITE_URL}/assets/images/hero-1.webp` });
      this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    });
    this.artikelService.getAll(this.lang).subscribe(data => {
      this.artikel = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }

  formatDate(dateStr: string): string {
    const locale = this.lang === 'de' ? 'de-CH' : this.lang === 'fr' ? 'fr-CH' : 'en-GB';
    return new Date(dateStr).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
