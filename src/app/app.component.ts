import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageProviderService } from './common/services/languageProvider.service';
import { LanguageSwitcherComponent } from './common/components/languageSwitcher/languageSwitcher.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, LanguageSwitcherComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'domotix';

  constructor(languageProvider: LanguageProviderService){
    languageProvider.useDefaultLanguage();
  }
}
