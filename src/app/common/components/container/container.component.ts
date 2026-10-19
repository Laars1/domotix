import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  standalone: true,
  imports: [CommonModule],
  // A block, not the default inline: the navigation and the anchor links read
  // this element's position, and an inline box around a block reports it wrong
  // once a neighbour pulls the layout up with a negative margin.
  styles: [':host { display: block; }'],
})
export class ContainerComponent  {
  @Input() customCss: string | undefined
}