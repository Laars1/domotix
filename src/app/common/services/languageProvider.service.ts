import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class LanguageProviderService {
  constructor(private translateService: TranslateService) {}

  useDefaultLanguage(){
    let language = this.translateService.getBrowserLang() || 'de';
    if (!this.isLanguageProvided(language)) {
        language = 'de';
    }
    this.translateService.setDefaultLang(language);
  }

  useLanguage(language: string): void {
    if(!this.isLanguageProvided(language)){
      throw new Error("Unknown language provided");
    }

    this.translateService.use(language);
  }

  private isLanguageProvided(language: string){
    return environment.providedLanguages.includes(language)
  }
}
