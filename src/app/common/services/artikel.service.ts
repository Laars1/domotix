import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artikel } from '../models/artikel';
import { LanguageProviderService } from './languageProvider.service';

@Injectable({ providedIn: 'root' })
export class ArtikelService {
  private http = inject(HttpClient);
  private lang = inject(LanguageProviderService);

  private get currentLang(): string {
    return this.lang.getCurrentLanguage() || 'de';
  }

  getAll(): Observable<Artikel[]> {
    return this.http.get<Artikel[]>(`assets/artikel/${this.currentLang}/index.json`);
  }

  getContent(slug: string): Observable<string> {
    return this.http.get(`assets/artikel/${this.currentLang}/${slug}.md`, { responseType: 'text' });
  }
}
