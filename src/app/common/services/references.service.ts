/* eslint-disable no-unused-vars */
import { Injectable } from '@angular/core';
import * as deData from '../../../assets/data/references/de.json';
import * as enData from '../../../assets/data/references/en.json';
import * as frData from '../../../assets/data/references/fr.json';
import * as itData from '../../../assets/data/references/it.json';
import { Reference } from '../models/reference';
import { LanguageProviderService } from './languageProvider.service';

@Injectable({
  providedIn: 'root',
})
export class ReferencesService {
  private data: { [key: string]: Reference[] } = {
    de: (deData as unknown as { default: Reference[] }).default,
    en: (enData as unknown as { default: Reference[] }).default,
    fr: (frData as unknown as { default: Reference[] }).default,
    it: (itData as unknown as { default: Reference[] }).default,
  };

  constructor(private languageProvider: LanguageProviderService) {}

  /**
   * Retrieves references for the current language.
   * @returns Array of references for the current language.
   */
  public get(): Reference[] {
    const language = this.languageProvider.getCurrentLanguage();
    return this.data[language] || [];
  }
}
