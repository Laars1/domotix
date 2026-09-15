import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Reference } from '../models/reference';

@Injectable({
  providedIn: 'root',
})
export class ReferencesService {
  private http = inject(HttpClient);

  /** One in-flight/replayed request per language — the JSON is fetched at most once. */
  private cache = new Map<string, Observable<Reference[]>>();

  /**
   * Everything in the file, drafts included. Only used where a draft must still
   * be reachable — namely a direct URL to its detail page.
   */
  private getRaw(lang: string): Observable<Reference[]> {
    let request = this.cache.get(lang);
    if (!request) {
      request = this.http.get<Reference[]>(`assets/data/references/${lang}.json`).pipe(
        catchError(() => of([] as Reference[])),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
      this.cache.set(lang, request);
    }
    return request;
  }

  /**
   * Published references for a language, in the order they appear in the JSON.
   * Drafts are filtered out, so they show up neither in the mosaic nor in the
   * prev/next navigation nor in the ItemList structured data.
   * Missing or broken files resolve to an empty list instead of erroring.
   */
  getAll(lang: string): Observable<Reference[]> {
    return this.getRaw(lang).pipe(map(list => list.filter(entry => !entry.draft)));
  }

  /**
   * A single reference, or `undefined` if the slug is unknown in that language.
   * Searches drafts too, so an unpublished entry can be previewed by URL.
   */
  getBySlug(lang: string, slug: string): Observable<Reference | undefined> {
    return this.getRaw(lang).pipe(map(list => list.find(entry => entry.slug === slug)));
  }

  /**
   * The Markdown body of a reference — same split as the articles use: metadata
   * in the index JSON, prose in its own file. A missing file resolves to an
   * empty string so the page still renders its header and metadata.
   */
  getContent(lang: string, slug: string): Observable<string> {
    return this.http.get(`assets/referenzen/${lang}/${slug}.md`, { responseType: 'text' }).pipe(
      catchError(() => of('')),
    );
  }

  /**
   * Previous/next reference relative to a slug, for the detail page footer navigation.
   * Wraps around, so the last entry links back to the first.
   */
  getNeighbours(lang: string, slug: string): Observable<{ prev?: Reference; next?: Reference }> {
    return this.getAll(lang).pipe(
      map(list => {
        const index = list.findIndex(entry => entry.slug === slug);
        if (index === -1 || list.length < 2) return {};
        return {
          prev: list[(index - 1 + list.length) % list.length],
          next: list[(index + 1) % list.length],
        };
      }),
    );
  }
}
