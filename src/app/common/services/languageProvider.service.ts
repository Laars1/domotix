/* eslint-disable no-unused-vars */
import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class LanguageProviderService {
  // Behavior subject in order to detect language changes, which can be used to update static services
  language$ = new BehaviorSubject('de');

  private doc = inject(DOCUMENT);

  constructor(private translateService: TranslateService) {
    // Keep <html lang> in step with the active language. index.html ships
    // lang="de"; without this, /fr and /en pages would still announce German
    // to screen readers, search engines and the browser's hyphenation.
    this.language$.subscribe(language => {
      this.doc.documentElement.lang = language;
    });
  }

  /**
   * Set default language for user by its browser config is supported, otherwise german will be the default language
   */
  useDefaultLanguage(){
    let language = this.translateService.getBrowserLang() || 'de';
    if (!this.isLanguageProvided(language)) {
        language = 'de';
    }
    this.translateService.setDefaultLang(language);
    this.translateService.currentLang = language;
    this.language$.next(language);
  }

  /**
   * Set language to input language
   * @param language to change to
   */
  useLanguage(language: string): void {
    if(!this.isLanguageProvided(language)){
      throw new Error("Unknown language provided");
    }

    this.translateService.use(language);
    this.translateService.currentLang = language;
    this.language$.next(language);
  }

  /**
   * Get current language
   */
  getCurrentLanguage(){
    return this.translateService.currentLang;
  }

  /**
   * Get supported languages from environments
   * @returns string array of supported languages
   */
  getSupportedLanguages() : string[] {
    return environment.providedLanguages;
  }

  /**
   * Check if input language is provided by the system
   * @param language language you want to check
   * @returns true if language is provided, otherwise false
   */
  private isLanguageProvided(language: string) : boolean {
    return environment.providedLanguages.includes(language)
  }
}
