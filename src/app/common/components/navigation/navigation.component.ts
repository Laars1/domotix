import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

const NAV_HEIGHT = 64;

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

  private readonly scroller = inject(ViewportScroller);
  private readonly router = inject(Router);

  ngOnInit(): void {
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
  }

  private onScroll = (): void => {
    this.scrolled = window.scrollY > 200;

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
