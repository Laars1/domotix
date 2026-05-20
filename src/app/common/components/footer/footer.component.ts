import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class FooterComponent {
  modalOpen = false;
  activeTab: 'privacy' | 'imprint' = 'privacy';

  open(): void {
    this.modalOpen = true;
    this.activeTab = 'privacy';
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.modalOpen = false;
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.close(); }
}
