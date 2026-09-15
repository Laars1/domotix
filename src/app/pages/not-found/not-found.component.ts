import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NavigationComponent } from '../../common/components/navigation/navigation.component';
import { FooterComponent } from '../../common/components/footer/footer.component';
import { SeoService } from '../../common/services/seo.service';

/**
 * Catch-all for unknown URLs. The server still answers 200 (the SPA rewrite
 * serves index.html for every path), so the noindex tag is what keeps these
 * pages out of search results — previously they silently showed the home page,
 * which search engines read as duplicate content.
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, TranslateModule, NavigationComponent, FooterComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent implements OnInit, OnDestroy {
  private meta = inject(Meta);
  private title = inject(Title);
  private translate = inject(TranslateService);
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.meta.updateTag({ name: 'robots', content: 'noindex' });
    this.seo.removeCanonical();
    this.seo.clearHreflangs();
    this.translate.get('notFound.title').subscribe(t => this.title.setTitle(`${t} – Domotix GmbH`));
  }

  ngOnDestroy(): void {
    this.meta.removeTag("name='robots'");
  }
}
