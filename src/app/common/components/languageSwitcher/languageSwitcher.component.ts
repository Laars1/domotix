import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageProviderService } from '../../services/languageProvider.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-languageSwitcher',
  templateUrl: './languageSwitcher.component.html',
  styleUrls: ['./languageSwitcher.component.css'],
  imports: [RouterOutlet, TranslateModule, CommonModule],
  standalone: true
})
export class LanguageSwitcherComponent implements OnInit {
  supportedLanguages: string[] = [];

  constructor(private languageProvider: LanguageProviderService) { }

  ngOnInit() {
    this.supportedLanguages = this.languageProvider.getSupportedLanguages();
  }

  switchLanguage(language: string){
    this.languageProvider.useLanguage(language);
  }
}
