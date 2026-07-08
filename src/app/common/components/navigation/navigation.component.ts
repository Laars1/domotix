import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { LanguageProviderService } from '../../services/languageProvider.service';

const NAV_HEIGHT = 64;

// Routes without a hero image behind the nav — bar must stay solid/dark-text from the top.
// Matches the artikel LIST page ('/artikel/:lang') only — the detail page
// ('/artikel/:lang/:slug') DOES have a hero image, so it's excluded here.
const NO_HERO_PATTERN = /^\/artikel\/[a-z]{2}$/;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  standalone: true,
  imports: [TranslateModule, LanguageSwitcherComponent, CommonModule, RouterLink],
})
export class NavigationComponent implements OnInit, OnDestroy {
  scrolled = false;
  overDark = false;
  mobileOpen = false;
  noHero = false;

  private readonly scroller = inject(ViewportScroller);
  private readonly router = inject(Router);
  private readonly langProvider = inject(LanguageProviderService);
  private routerSub: Subscription | undefined;

  get currentLanguage(): string {
    return this.langProvider.getCurrentLanguage() || 'de';
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.updateNoHero(this.router.url);
    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateNoHero(event.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    this.routerSub?.unsubscribe();
  }

  private updateNoHero(url: string): void {
    const path = url.split(/[?#]/)[0].replace(/\/$/, '');
    this.noHero = NO_HERO_PATTERN.test(path);
  }

  private onScroll = (): void => {
    // On the home page, stay transparent for the full hero image height and
    // only go solid once it has scrolled out from behind the nav.
    const heroEl = document.getElementById('home');
    this.scrolled = heroEl
      ? heroEl.getBoundingClientRect().bottom <= NAV_HEIGHT
      : window.scrollY > 200;

    const aboutEl = document.getElementById('about');
    if (aboutEl) {
      const rect = aboutEl.getBoundingClientRect();
      this.overDark = rect.top <= NAV_HEIGHT && rect.bottom > NAV_HEIGHT;
    }
  };

  scrollToSection(fragment: string) {
    this.mobileOpen = false;
    if (this.router.url === '/' || this.router.url === '') {
      this.scroller.scrollToAnchor(fragment);
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scroller.scrollToAnchor(fragment), 100);
      });
    }
  }

  toggleNav() {
    this.mobileOpen = !this.mobileOpen;
  }
}
