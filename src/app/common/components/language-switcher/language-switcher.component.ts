import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageProviderService } from '../../services/languageProvider.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Matches '/artikel/<lang>' or '/artikel/<lang>/<slug>' — the only section with language-specific URLs.
const ARTIKEL_ROUTE_PATTERN = /^\/artikel\/[a-z]{2}(\/[^/]+)?$/;

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
    const match = this.router.url.match(ARTIKEL_ROUTE_PATTERN);
    if (match) {
      const rest = match[1] || '';
      this.router.navigateByUrl(`/artikel/${language}${rest}`);
      return;
    }
    this.languageProvider.useLanguage(language);
  }
}