import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CONFIGURATION_CONSTANT } from '../../../shared/constants/configuration.constants';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: true,
  imports: [TranslateModule]
})
export class AboutComponent {
  protected readonly email: string = CONFIGURATION_CONSTANT.email;
}