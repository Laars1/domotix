import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-energy',
  templateUrl: './energy.component.html',
  styleUrls: ['./energy.component.scss'],
  standalone: true,
  imports: [TranslateModule, NgOptimizedImage]
})
export class EnergyComponent {
  constructor() { }
}
