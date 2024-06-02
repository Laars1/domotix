import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageProviderService } from './common/services/languageProvider.service';
import { NavigationComponent } from './common/components/navigation/navigation.component';
import { ParallaxWrapperComponent } from './common/components/parallax-wrapper/parallax-wrapper.component';
import { HomeComponent } from './common/components/home/home.component';
import { VisionComponent } from './common/components/vision/vision.component';
import { LightComponent } from './common/components/light/light.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, ParallaxWrapperComponent, NavigationComponent, HomeComponent, VisionComponent, LightComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'domotix';

  constructor(languageProvider: LanguageProviderService){
    languageProvider.useDefaultLanguage();
  }
}
