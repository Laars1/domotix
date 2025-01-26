/* eslint-disable no-unused-vars */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CardComponent {
  @Input() id!: number
  @Input() title: string | undefined;
  @Input() subtitle: string | undefined;
  @Input() imgSrc: string | undefined;
  @Input() customTitleCss: string | undefined;
  @Input() hasText = true;
  @Input() largePadding = false;
  @Input() blur = true;
  @Output() action = new EventEmitter<number>();

  constructor() { }

  performCallback(){
    this.action.emit(this.id);
  }
}
