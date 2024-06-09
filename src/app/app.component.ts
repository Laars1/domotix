import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageProviderService } from './common/services/languageProvider.service';
import { NavigationComponent } from './common/components/navigation/navigation.component';
import { ParallaxWrapperComponent } from './common/components/parallax-wrapper/parallax-wrapper.component';
import { HomeComponent } from './common/components/home/home.component';
import { VisionComponent } from './common/components/vision/vision.component';
import { LightComponent } from './common/components/light/light.component';
import { HeatingComponent } from './common/components/heating/heating.component';
import { ShutterComponent } from './common/components/shutter/shutter.component';
import { MultimediaComponent } from './common/components/multimedia/multimedia.component';
import { EnergyComponent } from './common/components/energy/energy.component';
import { SecurityComponent } from './common/components/security/security.component';
import { AboutComponent } from './common/components/about/about.component';
import { ContactComponent } from './common/components/contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TranslateModule,
    ParallaxWrapperComponent,
    NavigationComponent,
    HomeComponent,
    VisionComponent,
    LightComponent,
    HeatingComponent,
    ShutterComponent,
    MultimediaComponent,
    EnergyComponent,
    SecurityComponent,
    AboutComponent,
    ContactComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'domotix';

  constructor(languageProvider: LanguageProviderService) {
    languageProvider.useDefaultLanguage();
  }
}
