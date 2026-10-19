import { CommonModule, ViewportScroller } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, QueryList, ViewChildren, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

type SceneId = 'day' | 'night' | 'tv' | 'golf';

interface LightScene {
  id: SceneId;
  img: string;
}

@Component({
  selector: 'app-vision',
  templateUrl: './vision.component.html',
  styleUrls: ['./vision.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class VisionComponent implements AfterViewInit, OnDestroy {
  private readonly scroller = inject(ViewportScroller);
  private readonly zone = inject(NgZone);

  /**
   * The four images show the same cut-away house under different lighting.
   * They share one frame and have a transparent background, so stacking them
   * and fading the active one in reads as the light changing, not the picture.
   */
  readonly scenes: LightScene[] = [
    { id: 'day',   img: 'assets/images/Landing/Vision/vision-tag.webp' },
    { id: 'night', img: 'assets/images/Landing/Vision/vision-nacht.webp' },
    { id: 'tv',    img: 'assets/images/Landing/Vision/vision-tv.webp' },
    { id: 'golf',  img: 'assets/images/Landing/Vision/vision-golf.webp' },
  ];

  /**
   * One spacer per layout (wide and stacked); CSS shows only one. Its height is
   * the scroll distance during which the element right before it stays pinned,
   * and how far it has passed under that element decides the scene.
   */
  @ViewChildren('spacer') private spacers!: QueryList<ElementRef<HTMLElement>>;

  activeScene: SceneId = 'day';
  /**
   * The scene shown before the current one. It stays opaque underneath while
   * the new one fades in, then is hidden so its soft edges don't double up.
   */
  previousScene: SceneId | undefined;

  private frame: number | undefined;

  /** Position of the active scene in the list; drives the sliding marker beside the links. */
  get activeIndex(): number {
    return this.scenes.findIndex(scene => scene.id === this.activeScene);
  }

  scrollToSection(fragment: string) {
    this.scroller.scrollToAnchor(fragment);
  }

  /** Scrolls to the middle of the scene's stretch, so scroll position and scene stay in step. */
  select(id: SceneId) {
    const track = this.track();
    if (!track) {
      this.show(id);
      return;
    }
    const index = this.scenes.findIndex(scene => scene.id === id);
    const { pin, spacer } = track;
    const pinnedBottom = (parseFloat(getComputedStyle(pin).top) || 0) + pin.offsetHeight;
    const target = ((index + 0.5) / this.scenes.length) * spacer.offsetHeight;
    const distance = target - pinnedBottom + spacer.getBoundingClientRect().top;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollBy({ top: distance, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  onFadeEnd(id: SceneId) {
    if (id === this.activeScene) {
      this.previousScene = undefined;
    }
  }

  ngAfterViewInit() {
    // Scroll events fire constantly; only re-enter Angular when the scene changes.
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll, { passive: true });
    });
    this.update();
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    if (this.frame !== undefined) {
      cancelAnimationFrame(this.frame);
    }
  }

  private onScroll = () => {
    if (this.frame === undefined) {
      this.frame = requestAnimationFrame(() => {
        this.frame = undefined;
        this.update();
      });
    }
  };

  /** The visible spacer and the element pinned above it. */
  private track(): { pin: HTMLElement; spacer: HTMLElement } | undefined {
    const spacer = this.spacers?.find(ref => ref.nativeElement.offsetHeight > 0)?.nativeElement;
    const pin = spacer?.previousElementSibling as HTMLElement | null;
    return spacer && pin ? { pin, spacer } : undefined;
  }

  /**
   * Before pinning the spacer sits right under the pinned element (progress 0);
   * while pinned it slides up beneath it; when it has fully passed, the pinned
   * element is released (progress 1).
   */
  private update() {
    const track = this.track();
    if (!track) {
      return;
    }
    const { pin, spacer } = track;
    const spacerRect = spacer.getBoundingClientRect();
    const progress = (pin.getBoundingClientRect().bottom - spacerRect.top) / spacerRect.height;
    const clamped = Math.min(Math.max(progress, 0), 1);
    const index = Math.min(this.scenes.length - 1, Math.floor(clamped * this.scenes.length));
    if (index !== this.activeIndex) {
      this.zone.run(() => this.show(this.scenes[index].id));
    }
  }

  private show(id: SceneId) {
    if (id === this.activeScene) {
      return;
    }
    this.previousScene = this.activeScene;
    this.activeScene = id;
  }
}
