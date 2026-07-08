import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { LanguageProviderService } from './common/services/languageProvider.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'domotix';

  constructor(languageProvider: LanguageProviderService, private readonly scroller: ViewportScroller) {
    languageProvider.useDefaultLanguage();
    scroller.setOffset([0, 80]);
  }
}
