import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ArtikelService } from '../../common/services/artikel.service';
import { LanguageProviderService } from '../../common/services/languageProvider.service';
import { Artikel } from '../../common/models/artikel';
import { NavigationComponent } from '../../common/components/navigation/navigation.component';
import { FooterComponent } from '../../common/components/footer/footer.component';

@Component({
  selector: 'app-artikel-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, NavigationComponent, FooterComponent],
  templateUrl: './artikel-list.component.html',
  styleUrl: './artikel-list.component.scss',
})
export class ArtikelListComponent implements OnInit, OnDestroy {
  private artikelService = inject(ArtikelService);
  private langProvider = inject(LanguageProviderService);
  private translate = inject(TranslateService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private langSub?: Subscription;

  artikel: Artikel[] = [];

  ngOnInit(): void {
    this.load();
    this.langSub = this.langProvider.language$.subscribe(() => this.load());
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  private load(): void {
    this.translate.get(['artikel.pageTitle']).subscribe(t => {
      this.titleService.setTitle(`${t['artikel.pageTitle']} – Domotix GmbH`);
    });
    this.metaService.updateTag({
      name: 'description',
      content: 'Fachwissen rund um Gebäudeautomation, Smart Home und Energieeffizienz – von den Experten der Domotix GmbH aus Bern.',
    });
    this.artikelService.getAll().subscribe(data => {
      this.artikel = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }

  formatDate(dateStr: string): string {
    const lang = this.langProvider.getCurrentLanguage() || 'de';
    const locale = lang === 'de' ? 'de-CH' : lang === 'fr' ? 'fr-CH' : lang === 'it' ? 'it-CH' : 'en-GB';
    return new Date(dateStr).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
