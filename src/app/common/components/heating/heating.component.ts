import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-heating',
  templateUrl: './heating.component.html',
  styleUrls: ['./heating.component.scss'],
  standalone: true,
  imports: [TranslateModule, NgOptimizedImage]
})
export class HeatingComponent {

  constructor() { }

}
