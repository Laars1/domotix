import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

interface ServiceTile {
  key: string;
  icon: string;
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class ServicesComponent {
  readonly services: ServiceTile[] = [
    { key: 'light',      icon: 'bi-lamp'             },
    { key: 'heating',    icon: 'bi-thermometer-half' },
    { key: 'shutter',    icon: 'bi-rocket-takeoff'   },
    { key: 'multimedia', icon: 'bi-cassette'         },
    { key: 'energy',     icon: 'bi-lightning-charge' },
    { key: 'security',   icon: 'bi-shield'           },
  ];

  activeService: ServiceTile | null = null;

  open(service: ServiceTile): void {
    this.activeService = service;
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.activeService = null;
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
