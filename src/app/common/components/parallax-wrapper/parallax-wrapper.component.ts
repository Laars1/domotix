import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-parallax-wrapper',
  templateUrl: './parallax-wrapper.component.html',
  styleUrls: ['./parallax-wrapper.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ParallaxWrapperComponent implements OnInit, OnDestroy {
  @Input() imgSrc: string | undefined;
  @Input() imgSrcs: string[] = [];
  /**
   * Portrait counterparts to `imgSrcs`, matched by index. Shown on portrait
   * screens (see the aspect-ratio query in the SCSS) so the crop on phones is
   * decided by the picture itself rather than by cutting a strip out of a
   * landscape image. Slides without an entry fall back to the landscape image.
   */
  @Input() imgSrcsMobile: string[] = [];
  @Input() linearGradient: boolean = false;
  @Input() customCss: string | undefined;

  currentIndex = 0;

  private randomStart(): void {
    if (this.slides.length > 1) {
      this.currentIndex = Math.floor(Math.random() * this.slides.length);
    }
  }
  private interval: ReturnType<typeof setInterval> | undefined;

  get slides(): string[] {
    return this.imgSrcs.length ? this.imgSrcs : (this.imgSrc ? [this.imgSrc] : []);
  }

  hasMobile(index: number): boolean {
    return !!this.imgSrcsMobile[index];
  }

  /**
   * Passes both images to the stylesheet as custom properties; the media query
   * there picks one. Browsers only fetch the background that actually applies,
   * so a phone never downloads the landscape set.
   */
  slideStyle(index: number): string {
    const desktop = this.backgroundValue(this.slides[index]);
    const mobileSrc = this.imgSrcsMobile[index];
    const mobile = mobileSrc ? this.backgroundValue(mobileSrc) : desktop;
    return `--slide-bg: ${desktop}; --slide-bg-mobile: ${mobile};`;
  }

  /** An .avif source gets a WebP sibling via image-set; anything else is used as-is. */
  private backgroundValue(src: string): string {
    const webpSrc = src.replace(/\.avif$/i, '.webp');
    if (webpSrc === src) {
      return `url('${src}')`;
    }
    return `image-set(url('${webpSrc}') type('image/webp'), url('${src}') type('image/avif'))`;
  }

  ngOnInit() {
    if (this.slides.length > 1) {
      this.randomStart();
      this.interval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      }, 10000);
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

}
