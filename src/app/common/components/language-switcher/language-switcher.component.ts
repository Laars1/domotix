import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageProviderService } from '../../services/languageProvider.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
  imports: [TranslateModule, CommonModule],
  standalone: true
})
export class LanguageSwitcherComponent implements OnInit, OnDestroy {
  private languageProvider = inject(LanguageProviderService);
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
    this.languageProvider.useLanguage(language);
  }
}