import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class ContainerComponent  {
  @Input() customCss: string | undefined

  constructor() { } 

}
