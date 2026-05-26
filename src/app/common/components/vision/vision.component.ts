import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-vision',
  templateUrl: './vision.component.html',
  styleUrls: ['./vision.component.scss'],
  standalone: true,
  imports: [TranslateModule],
})
export class VisionComponent {
  private readonly scroller = inject(ViewportScroller);

  scrollToSection(fragment: string) {
    this.scroller.scrollToAnchor(fragment);
  }
}
