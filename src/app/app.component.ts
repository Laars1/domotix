import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageProviderService } from './common/services/languageProvider.service';
import { LanguageSwitcherComponent } from './common/components/language-switcher/language-switcher.component';
import { NavigationComponent } from './common/components/navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, LanguageSwitcherComponent, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'domotix';

  constructor(languageProvider: LanguageProviderService){
    languageProvider.useDefaultLanguage();
  }
}
