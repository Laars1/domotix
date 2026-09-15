import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { ReferencesService } from '../../common/services/references.service';
import { LanguageProviderService } from '../../common/services/languageProvider.service';
import { Reference } from '../../common/models/reference';
import { ReferenceImage, toReferenceImage } from '../../common/models/reference-content';
import { NavigationComponent } from '../../common/components/navigation/navigation.component';
import { FooterComponent } from '../../common/components/footer/footer.component';
import { CtaBandComponent } from '../../common/components/cta-band/cta-band.component';
import { SeoService, SITE_URL } from '../../common/services/seo.service';
import { CONFIGURATION_CONSTANT } from '../../shared/constants/configuration.constants';

/**
 * One row of the mosaic: a narrow tile and a wide tile.
 *
 * A project fills one row per image pair — 2 images make one row, 4 images make
 * two. The narrow tile always shows the project's lead image and carries the
 * title overlay on the project's first row; which side it sits on alternates
 * down the page.
 */
export interface MosaicRow {
  reference: Reference;
  /** Image in the narrow tile. */
  lead: ReferenceImage;
  /** Image in the wide tile. Absent when a project has an odd number of images. */
  wide?: ReferenceImage;
  /** True on the project's first row, where the title overlay is rendered. */
  showTitle: boolean;
  /** Narrow tile on the left (true) or on the right (false). */
  narrowLeft: boolean;
}

/** Rows above this index are lazy-loaded; the first two carry the LCP. */
const EAGER_ROWS = 2;

@Component({
  selector: 'app-referenzen-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, NavigationComponent, FooterComponent, CtaBandComponent],
  templateUrl: './referenzen-list.component.html',
  styleUrl: './referenzen-list.component.scss',
})
export class ReferenzenListComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private referencesService = inject(ReferencesService);
  private langProvider = inject(LanguageProviderService);
  private translate = inject(TranslateService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private seo = inject(SeoService);
  private paramSub?: Subscription;

  references: Reference[] = [];
  rows: MosaicRow[] = [];
  lang = 'de';
  /** False until the first JSON response — keeps the "empty" notice from flashing. */
  loaded = false;
  readonly email: string = CONFIGURATION_CONSTANT.email;

  ngOnInit(): void {
    this.paramSub = this.route.paramMap
      .pipe(
        filter(params => {
          const routeLang = params.get('lang') || 'de';
          if (this.langProvider.getSupportedLanguages().includes(routeLang)) return true;
          this.router.navigate(['/referenzen', 'de']);
          return false;
        }),
        // A quick language switch must not let the older list land last.
        switchMap(params => {
          this.lang = params.get('lang') || 'de';
          this.langProvider.useLanguage(this.lang);
          this.seo.setCanonical(`/referenzen/${this.lang}`);
          this.seo.setHreflangs(this.langProvider.getSupportedLanguages(), l => `/referenzen/${l}`);
          return this.referencesService.getAll(this.lang);
        }),
      )
      .subscribe(data => {
        this.references = data;
        this.rows = this.buildRows(data);
        this.loaded = true;
        this.updateMeta();
      });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
    this.seo.clearHreflangs();
    this.seo.removeJsonLd('ld-references');
  }

  loading(index: number): 'eager' | 'lazy' {
    return index < EAGER_ROWS ? 'eager' : 'lazy';
  }

  private buildRows(references: Reference[]): MosaicRow[] {
    const rows: MosaicRow[] = [];

    for (const reference of references) {
      const images = reference.content.images.map(toReferenceImage);
      for (let i = 0; i < images.length; i += 2) {
        rows.push({
          reference,
          lead: images[i],
          wide: images[i + 1],
          showTitle: i === 0,
          // Overwritten below — the side alternates across the whole page, not
          // per project, so the rhythm carries through project boundaries.
          narrowLeft: true,
        });
      }
    }

    return rows.map((row, index) => ({ ...row, narrowLeft: index % 2 === 0 }));
  }

  private updateMeta(): void {
    this.translate.get(['references.pageTitle', 'references.metaDescription']).subscribe(t => {
      const title = `${t['references.pageTitle']} – Domotix GmbH`;
      const description = t['references.metaDescription'];
      const url = `${SITE_URL}/referenzen/${this.lang}`;

      this.titleService.setTitle(title);
      this.metaService.updateTag({ name: 'description', content: description });
      this.metaService.updateTag({ property: 'og:title', content: title });
      this.metaService.updateTag({ property: 'og:description', content: description });
      this.metaService.updateTag({ property: 'og:url', content: url });
      this.metaService.updateTag({ property: 'og:type', content: 'website' });
      this.metaService.updateTag({ property: 'og:image', content: `${SITE_URL}/assets/images/hero-1.webp` });
      this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.metaService.updateTag({ name: 'twitter:title', content: title });
      this.metaService.updateTag({ name: 'twitter:description', content: description });

      // An ItemList lets search engines read the overview as a collection of
      // projects and follow through to the individual detail pages.
      this.seo.setJsonLd('ld-references', {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: t['references.pageTitle'],
        description,
        url,
        numberOfItems: this.references.length,
        itemListElement: this.references.map((reference, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: reference.title,
          url: `${SITE_URL}/referenzen/${this.lang}/${reference.slug}`,
        })),
      });
    });
  }
}
