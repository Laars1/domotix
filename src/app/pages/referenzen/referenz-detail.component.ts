import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
import { MarkdownModule } from 'ngx-markdown';
import { Subscription, forkJoin } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { ReferencesService } from '../../common/services/references.service';
import { LanguageProviderService } from '../../common/services/languageProvider.service';
import { Reference } from '../../common/models/reference';
import { NavigationComponent } from '../../common/components/navigation/navigation.component';
import { FooterComponent } from '../../common/components/footer/footer.component';
import { SeoService, SITE_URL } from '../../common/services/seo.service';

@Component({
  selector: 'app-referenz-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, MarkdownModule, NavigationComponent, FooterComponent],
  templateUrl: './referenz-detail.component.html',
  styleUrl: './referenz-detail.component.scss',
})
export class ReferenzDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private referencesService = inject(ReferencesService);
  private langProvider = inject(LanguageProviderService);
  private translate = inject(TranslateService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private seo = inject(SeoService);
  private paramSub?: Subscription;

  reference?: Reference;
  /** Markdown body from assets/referenzen/<lang>/<slug>.md. */
  content = '';
  prev?: Reference;
  next?: Reference;
  notFound = false;
  lang = 'de';

  ngOnInit(): void {
    this.paramSub = this.route.paramMap
      .pipe(
        filter(params => {
          const routeLang = params.get('lang') || 'de';
          if (this.langProvider.getSupportedLanguages().includes(routeLang)) return true;
          this.router.navigate(['/referenzen', 'de', params.get('slug') ?? '']);
          return false;
        }),
        // switchMap drops the previous load when the URL changes again before
        // it has answered — otherwise clicking "next" twice quickly could let
        // the older response land last and show the wrong project.
        switchMap(params => {
          const lang = params.get('lang') || 'de';
          const slug = params.get('slug') ?? '';
          this.lang = lang;
          this.langProvider.useLanguage(lang);
          return forkJoin({
            reference: this.referencesService.getBySlug(lang, slug),
            neighbours: this.referencesService.getNeighbours(lang, slug),
            content: this.referencesService.getContent(lang, slug),
          }).pipe(map(result => ({ ...result, slug })));
        }),
      )
      .subscribe(({ reference, neighbours, content, slug }) => {
        this.reference = reference;
        this.content = content;
        this.prev = neighbours.prev;
        this.next = neighbours.next;
        this.notFound = !reference;

        if (reference) {
          this.updateMeta(reference, slug);
        } else {
          this.clearMeta();
          this.metaService.updateTag({ name: 'robots', content: 'noindex' });
        }
      });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
    this.clearMeta();
    // Other pages never set robots themselves, so a noindex left behind by a
    // draft or an unknown slug would silently carry over to them.
    this.metaService.removeTag("name='robots'");
  }

  /** Removes everything this page adds to <head> that other pages don't overwrite. */
  private clearMeta(): void {
    this.seo.removeCanonical();
    this.seo.clearHreflangs();
    this.seo.removeJsonLd('ld-reference');
    this.seo.removeJsonLd('ld-reference-breadcrumb');
  }

  private updateMeta(reference: Reference, slug: string): void {
    if (reference.draft) {
      // Reachable by URL for previewing, but must not be indexed.
      this.metaService.updateTag({ name: 'robots', content: 'noindex' });
    } else {
      this.metaService.removeTag("name='robots'");
    }

    const url = `${SITE_URL}/referenzen/${this.lang}/${slug}`;
    const image = `${SITE_URL}/${reference.headerImg}`;
    const title = `${reference.title} – Domotix GmbH`;
    const description = reference.description;

    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:url', content: url });
    this.metaService.updateTag({ property: 'og:type', content: 'article' });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: image });

    this.seo.setCanonical(`/referenzen/${this.lang}/${slug}`);
    this.seo.setHreflangs(this.langProvider.getSupportedLanguages(), l => `/referenzen/${l}/${slug}`);

    this.seo.setJsonLd('ld-reference', {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: reference.title,
      headline: reference.title,
      description: reference.description,
      image,
      dateCreated: reference.content.date,
      inLanguage: this.lang,
      url,
      keywords: reference.content.tags.join(', '),
      ...(reference.content.location
        ? { locationCreated: { '@type': 'Place', name: reference.content.location } }
        : {}),
      creator: {
        '@type': 'Organization',
        name: 'Domotix GmbH',
        url: SITE_URL,
      },
    });

    this.translate.get(['navigation.home', 'references.pageTitle']).subscribe(t => {
      // Translations may answer after the user has already moved on.
      if (this.reference !== reference) return;
      this.seo.setJsonLd('ld-reference-breadcrumb', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t['navigation.home'], item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: t['references.pageTitle'], item: `${SITE_URL}/referenzen/${this.lang}` },
          { '@type': 'ListItem', position: 3, name: reference.title, item: url },
        ],
      });
    });
  }
}
