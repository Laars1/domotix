/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-parallax-wrapper',
  templateUrl: './parallax-wrapper.component.html',
  styleUrls: ['./parallax-wrapper.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ParallaxWrapperComponent implements OnInit {

  @Input() imgSrc: string | undefined;
  @Input() linearGradient: boolean = false;
  @Input() customCss: string | undefined
  constructor() { }

  ngOnInit() {
  }

  setBackground() {
    if (!this.imgSrc) {
      return;
    }
  
    const backgroundImage = this.linearGradient 
      ? `linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 10%, rgba(4,12,14,0) 100%), url("${this.imgSrc}")`
      : `url("${this.imgSrc}")`;
  
    return {
      'background-image': backgroundImage
    };
  }

}
