import { Component, HostListener, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MarkdownModule } from 'ngx-markdown';
import { Observable, Subscription, of } from 'rxjs';
import { catchError, shareReplay, switchMap } from 'rxjs/operators';
import { LanguageProviderService } from '../../services/languageProvider.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, MarkdownModule],
})
export class FooterComponent implements OnDestroy {
  private http = inject(HttpClient);
  private langProvider = inject(LanguageProviderService);

  modalOpen = false;
  activeTab: 'privacy' | 'imprint' = 'privacy';

  /** Markdown body of the privacy policy in the active language. */
  privacyContent = '';

  private privacySub?: Subscription;
  /** One request per language, shared by every footer instance. */
  private static privacyCache = new Map<string, Observable<string>>();

  open(): void {
    this.modalOpen = true;
    this.activeTab = 'privacy';
    document.body.style.overflow = 'hidden';

    // The policy is only fetched once the modal is opened, and follows a
    // language switch while it stays open.
    this.privacySub ??= this.langProvider.language$
      .pipe(switchMap(lang => this.loadPrivacy(lang)))
      .subscribe(content => (this.privacyContent = content));
  }

  close(): void {
    this.modalOpen = false;
    document.body.style.overflow = '';
  }

  ngOnDestroy(): void {
    this.privacySub?.unsubscribe();
  }

  private loadPrivacy(lang: string): Observable<string> {
    let request = FooterComponent.privacyCache.get(lang);
    if (!request) {
      request = this.http.get(`assets/rechtliches/${lang}/datenschutz.md`, { responseType: 'text' }).pipe(
        // Fall back to German rather than showing an empty policy.
        catchError(() => (lang === 'de' ? of('') : this.loadPrivacy('de'))),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
      FooterComponent.privacyCache.set(lang, request);
    }
    return request;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.close(); }
}
