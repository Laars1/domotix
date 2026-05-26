import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CONFIGURATION_CONSTANT } from '../../../shared/constants/configuration.constants';

interface TeamMember {
  firstName: string;
  lastName: string;
  img: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class AboutComponent {
  protected readonly email: string = CONFIGURATION_CONSTANT.email;

  readonly employees: TeamMember[] = [
    { firstName: 'Shenthujan', lastName: 'Easwararanjan', img: 'assets/images/portraits/Easwararanjan_Shenthujan.png' },
    { firstName: 'Joel',       lastName: 'Pulfer',        img: 'assets/images/portraits/Pulfer_Joel.png' },
  ];
}
