import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  standalone: true,
  imports: [TranslateModule]
})
export class ContactComponent {

  constructor() { }
}
