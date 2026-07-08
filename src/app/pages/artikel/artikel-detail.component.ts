import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
import { MarkdownModule } from 'ngx-markdown';
import { forkJoin, Subscription } from 'rxjs';
import { ArtikelService } from '../../common/services/artikel.service';
import { LanguageProviderService } from '../../common/services/languageProvider.service';
import { Artikel } from '../../common/models/artikel';
import { NavigationComponent } from '../../common/components/navigation/navigation.component';
import { FooterComponent } from '../../common/components/footer/footer.component';
import { SeoService, SITE_URL } from '../../common/services/seo.service';

@Component({
  selector: 'app-artikel-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, MarkdownModule, NavigationComponent, FooterComponent],
  templateUrl: './artikel-detail.component.html',
  styleUrl: './artikel-detail.component.scss',
})
export class ArtikelDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private artikelService = inject(ArtikelService);
  private langProvider = inject(LanguageProviderService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private seo = inject(SeoService);
  private translate = inject(TranslateService);
  private paramSub?: Subscription;

  meta: Artikel | undefined;
  content = '';
  notFound = false;
  lang = 'de';

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const routeLang = params.get('lang') || 'de';
      if (!this.langProvider.getSupportedLanguages().includes(routeLang)) {
        this.router.navigate(['/artikel', 'de', params.get('slug')]);
        return;
      }
      this.lang = routeLang;
      this.langProvider.useLanguage(routeLang);
      this.load(params.get('slug') ?? '');
    });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
    this.seo.removeJsonLd('ld-article');
    this.seo.removeJsonLd('ld-breadcrumb');
  }

  private load(slug: string): void {
    forkJoin({
      list: this.artikelService.getAll(this.lang),
      content: this.artikelService.getContent(this.lang, slug),
    }).subscribe({
      next: ({ list, content }) => {
        this.meta = list.find(a => a.slug === slug);
        this.content = content;
        this.notFound = false;
        if (this.meta) {
          const url = `${SITE_URL}/artikel/${this.lang}/${slug}`;
          const image = `${SITE_URL}/${this.meta.headerImg}`;
          this.titleService.setTitle(`${this.meta.title} – Domotix GmbH`);
          this.metaService.updateTag({ name: 'description', content: this.meta.description });
          this.metaService.updateTag({ property: 'og:title', content: this.meta.title });
          this.metaService.updateTag({ property: 'og:description', content: this.meta.description });
          this.metaService.updateTag({ property: 'og:url', content: url });
          this.metaService.updateTag({ property: 'og:type', content: 'article' });
          this.metaService.updateTag({ property: 'og:image', content: image });
          this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
          this.metaService.updateTag({ name: 'twitter:title', content: this.meta.title });
          this.metaService.updateTag({ name: 'twitter:description', content: this.meta.description });
          this.metaService.updateTag({ name: 'twitter:image', content: image });
          this.seo.setCanonical(`/artikel/${this.lang}/${slug}`);
          this.seo.setJsonLd('ld-article', {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: this.meta.title,
            description: this.meta.description,
            image,
            datePublished: this.meta.date,
            inLanguage: this.lang,
            mainEntityOfPage: url,
            author: { '@type': 'Organization', name: 'Domotix GmbH' },
            publisher: { '@type': 'Organization', name: 'Domotix GmbH', logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/images/logo.svg` } },
          });
          this.translate.get(['navigation.home', 'artikel.nav']).subscribe(t => {
            this.seo.setJsonLd('ld-breadcrumb', {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: t['navigation.home'], item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: t['artikel.nav'], item: `${SITE_URL}/artikel/${this.lang}` },
                { '@type': 'ListItem', position: 3, name: this.meta!.title, item: url },
              ],
            });
          });
        }
      },
      error: () => { this.notFound = true; },
    });
  }

  formatDate(dateStr: string): string {
    const locale = this.lang === 'de' ? 'de-CH' : this.lang === 'fr' ? 'fr-CH' : 'en-GB';
    return new Date(dateStr).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
