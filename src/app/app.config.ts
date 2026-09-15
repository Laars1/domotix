import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      {
        path: '',
        loadComponent: () => import('./pages/home/home-page.component').then(m => m.HomePageComponent),
      },
      {
        path: 'artikel',
        redirectTo: 'artikel/de',
        pathMatch: 'full',
      },
      {
        path: 'artikel/:lang',
        loadComponent: () => import('./pages/artikel/artikel-list.component').then(m => m.ArtikelListComponent),
      },
      {
        path: 'artikel/:lang/:slug',
        loadComponent: () => import('./pages/artikel/artikel-detail.component').then(m => m.ArtikelDetailComponent),
      },
      {
        path: 'referenzen',
        redirectTo: 'referenzen/de',
        pathMatch: 'full',
      },
      {
        path: 'referenzen/:lang',
        loadComponent: () => import('./pages/referenzen/referenzen-list.component').then(m => m.ReferenzenListComponent),
      },
      {
        path: 'referenzen/:lang/:slug',
        loadComponent: () => import('./pages/referenzen/referenz-detail.component').then(m => m.ReferenzDetailComponent),
      },
      {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
      },
    ], withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      MarkdownModule.forRoot(),
      TranslateModule.forRoot({
        defaultLanguage: 'de',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ),
  ],
};
