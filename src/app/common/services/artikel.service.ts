import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artikel } from '../models/artikel';

@Injectable({ providedIn: 'root' })
export class ArtikelService {
  private http = inject(HttpClient);

  getAll(lang: string): Observable<Artikel[]> {
    return this.http.get<Artikel[]>(`assets/artikel/${lang}/index.json`);
  }

  getContent(lang: string, slug: string): Observable<string> {
    return this.http.get(`assets/artikel/${lang}/${slug}.md`, { responseType: 'text' });
  }
}
