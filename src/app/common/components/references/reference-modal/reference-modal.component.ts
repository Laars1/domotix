import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Reference } from '../../../models/reference';

@Component({
  selector: 'app-reference-modal',
  templateUrl: './reference-modal.component.html',
  styleUrls: ['./reference-modal.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ReferenceModalComponent  {
  @Input() content: Reference
  constructor() { }
}
