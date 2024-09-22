import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Reference } from '../../../models/reference';

@Component({
  selector: 'app-reference-card',
  templateUrl: './reference-card.component.html',
  styleUrls: ['./reference-card.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ReferenceCardComponent  {
  @Input() entry!: Reference
  constructor() { }
}
