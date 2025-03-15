/* eslint-disable no-unused-vars */
import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-vision',
  templateUrl: './vision.component.html',
  standalone: true,
  imports: [TranslateModule]
})
export class VisionComponent{

  constructor(private readonly scroller: ViewportScroller){}

  scrollToSection(fragment: string) {
    this.scroller.scrollToAnchor(fragment);
  }
}