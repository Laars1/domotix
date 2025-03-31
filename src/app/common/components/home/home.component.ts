import { Component } from '@angular/core';
import { CONFIGURATION_CONSTANT } from '../../../shared/constants/configuration.constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true
})
export class HomeComponent{
  protected readonly email: string = CONFIGURATION_CONSTANT.email
}