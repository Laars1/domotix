import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-heating',
  templateUrl: './heating.component.html',
  standalone: true,
  imports: [TranslateModule]
})
export class HeatingComponent {

  constructor() { }

}
