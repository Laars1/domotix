import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageProviderService } from '../../services/languageProvider.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Sections whose URL carries the language as its first segment:
// '/artikel/<lang>', '/artikel/<lang>/<slug>' and the same for '/referenzen'.
// On those routes the language must be switched by navigating, not just by
// swapping the translations — otherwise the URL keeps pointing at the old
// language while the page shows the new one.
const LOCALISED_ROUTE_PATTERN = /^\/(artikel|referenzen)\/[a-z]{2}(\/[^/]+)?$/;

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
  imports: [TranslateModule, CommonModule],
  standalone: true
})
export class LanguageSwitcherComponent implements OnInit, OnDestroy {
  private languageProvider = inject(LanguageProviderService);
  private router = inject(Router);
  private langSub?: Subscription;

  supportedLanguages: string[] = [];
  currentLanguage: string = '';

  ngOnInit(): void {
    this.supportedLanguages = this.languageProvider.getSupportedLanguages();
    this.langSub = this.languageProvider.language$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  switchLanguage(language: string): void {
    // Drop any query string or fragment before matching.
    const path = this.router.url.split(/[?#]/)[0];
    const match = path.match(LOCALISED_ROUTE_PATTERN);

    if (match) {
      const [, section, rest] = match;
      // The slug is identical across languages, so it carries over unchanged.
      // Navigating re-runs the route subscription, which sets the language.
      this.router.navigateByUrl(`/${section}/${language}${rest ?? ''}`);
      return;
    }

    this.languageProvider.useLanguage(language);
  }
}