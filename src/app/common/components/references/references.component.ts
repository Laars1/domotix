import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReferencesService } from '../../services/references.service';
import { Reference } from '../../models/reference';
import { LanguageProviderService } from '../../services/languageProvider.service';

@Component({
  selector: 'app-references',
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class ReferencesComponent implements OnInit {
  entries: Reference[] = [];
  activeEntry: Reference | null = null;
  activeImageIndex = 0;

  private referenceService = inject(ReferencesService);
  private languageProvider = inject(LanguageProviderService);

  ngOnInit(): void {
    this.languageProvider.language$.subscribe({
      next: () => { this.entries = this.referenceService.get(); },
    });
  }

  getDetail(id: number): void {
    this.activeEntry = this.entries.find(x => x.id === id) ?? null;
    this.activeImageIndex = 0;
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.activeEntry = null;
    document.body.style.overflow = '';
  }

  prevImage(): void {
    if (!this.activeEntry) return;
    const len = this.activeEntry.content.images.length;
    this.activeImageIndex = (this.activeImageIndex - 1 + len) % len;
  }

  nextImage(): void {
    if (!this.activeEntry) return;
    const len = this.activeEntry.content.images.length;
    this.activeImageIndex = (this.activeImageIndex + 1) % len;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.close(); }
}
