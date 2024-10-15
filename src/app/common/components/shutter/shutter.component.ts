import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-shutter',
  templateUrl: './shutter.component.html',
  styleUrls: ['./shutter.component.scss'],
  standalone: true,
  imports: [TranslateModule, NgOptimizedImage]
})
export class ShutterComponent {

  constructor() { }

}
