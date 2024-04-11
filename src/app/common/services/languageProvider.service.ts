import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class LanguageProviderService {
  constructor(private translateService: TranslateService) {}

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
