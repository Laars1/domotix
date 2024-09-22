/* eslint-disable no-unused-vars */
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageProviderService } from '../../services/languageProvider.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
  imports: [RouterOutlet, TranslateModule, CommonModule],
  standalone: true
})
export class LanguageSwitcherComponent implements OnInit {
  supportedLanguages: string[] = [];
  currentLanguage: string = '';

  constructor(private languageProvider: LanguageProviderService) {}

  ngOnInit(): void {
    this.loadLanguages();
  }

  loadLanguages(): void {
    this.supportedLanguages = this.languageProvider.getSupportedLanguages();
    this.currentLanguage = this.languageProvider.getCurrentLanguage();
  }

  switchLanguage(language: string): void {
    this.languageProvider.useLanguage(language);
    this.currentLanguage = this.languageProvider.getCurrentLanguage();
  }
}