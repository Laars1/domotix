import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
import { MarkdownModule } from 'ngx-markdown';
import { forkJoin, Subscription } from 'rxjs';
import { ArtikelService } from '../../common/services/artikel.service';
import { LanguageProviderService } from '../../common/services/languageProvider.service';
import { Artikel } from '../../common/models/artikel';
import { NavigationComponent } from '../../common/components/navigation/navigation.component';
import { FooterComponent } from '../../common/components/footer/footer.component';

@Component({
  selector: 'app-artikel-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, MarkdownModule, NavigationComponent, FooterComponent],
  templateUrl: './artikel-detail.component.html',
  styleUrl: './artikel-detail.component.scss',
})
export class ArtikelDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private artikelService = inject(ArtikelService);
  private langProvider = inject(LanguageProviderService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private langSub?: Subscription;

  meta: Artikel | undefined;
  content = '';
  notFound = false;

  ngOnInit(): void {
    this.load();
    this.langSub = this.langProvider.language$.subscribe(() => this.load());
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  private load(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    forkJoin({
      list: this.artikelService.getAll(),
      content: this.artikelService.getContent(slug),
    }).subscribe({
      next: ({ list, content }) => {
        this.meta = list.find(a => a.slug === slug);
        this.content = content;
        this.notFound = false;
        if (this.meta) {
          this.titleService.setTitle(`${this.meta.title} – Domotix GmbH`);
          this.metaService.updateTag({ name: 'description', content: this.meta.description });
          this.metaService.updateTag({ property: 'og:title', content: this.meta.title });
          this.metaService.updateTag({ property: 'og:description', content: this.meta.description });
        }
      },
      error: () => { this.notFound = true; },
    });
  }

  formatDate(dateStr: string): string {
    const lang = this.langProvider.getCurrentLanguage() || 'de';
    const locale = lang === 'de' ? 'de-CH' : lang === 'fr' ? 'fr-CH' : lang === 'it' ? 'it-CH' : 'en-GB';
    return new Date(dateStr).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
