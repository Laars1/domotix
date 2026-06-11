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
