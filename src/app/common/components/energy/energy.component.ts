import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-energy',
  templateUrl: './energy.component.html',
  styleUrls: ['./energy.component.scss'],
  standalone: true,
  imports: [TranslateModule]
})
export class EnergyComponent {
  constructor() { }
}