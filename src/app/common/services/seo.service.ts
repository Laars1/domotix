import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

export const SITE_URL = 'https://www.domotix.ch';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private doc = inject(DOCUMENT);

  setCanonical(path: string): void {
    const href = `${SITE_URL}${path}`;
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  /**
   * Set <link rel="alternate" hreflang> tags for the given path per language.
   * `pathForLang` receives the language code and returns the path (e.g. `/artikel/de/planung`).
   * German is also declared as x-default.
   */
  // eslint-disable-next-line no-unused-vars
  setHreflangs(langs: string[], pathForLang: (lang: string) => string): void {
    this.clearHreflangs();
    const entries = langs.map(lang => ({ lang, href: `${SITE_URL}${pathForLang(lang)}` }));
    entries.push({ lang: 'x-default', href: `${SITE_URL}${pathForLang('de')}` });
    for (const entry of entries) {
      const link = this.doc.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', entry.lang);
      link.setAttribute('href', entry.href);
      this.doc.head.appendChild(link);
    }
  }

  clearHreflangs(): void {
    this.doc.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
  }

  setJsonLd(id: string, data: object): void {
    this.removeJsonLd(id);
    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.text = JSON.stringify(data);
    this.doc.head.appendChild(script);
  }

  removeJsonLd(id: string): void {
    this.doc.getElementById(id)?.remove();
  }
}
