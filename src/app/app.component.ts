import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageProviderService } from './common/services/languageProvider.service';
import { NavigationComponent } from './common/components/navigation/navigation.component';
import { ParallaxWrapperComponent } from './common/components/parallax-wrapper/parallax-wrapper.component';
import { HomeComponent } from './common/components/home/home.component';
import { VisionComponent } from './common/components/vision/vision.component';
import { ServicesComponent } from './common/components/services/services.component';
import { AboutComponent } from './common/components/about/about.component';
import { ReferencesComponent } from './common/components/references/references.component';
import { PartnerComponent } from './common/components/partner/partner.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { ContainerComponent } from './common/components/container/container.component';
import { CommonModule, ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TranslateModule,
    ParallaxWrapperComponent,
    NavigationComponent,
    HomeComponent,
    VisionComponent,
    ServicesComponent,
    AboutComponent,
    ReferencesComponent,
    PartnerComponent,
    FooterComponent,
    ContainerComponent,
    CommonModule,
  ],
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
