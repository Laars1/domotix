/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  standalone: true,
  imports: [TranslateModule, LanguageSwitcherComponent]
})
export class NavigationComponent implements OnInit {
  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true)
  }

  scroll = (): void => {
    if(window.scrollY > 900){
      document.body.style.setProperty('--show-navbar', "visible");
      document.body.style.setProperty('--opacity-navbar', "1");
    }else{
      document.body.style.setProperty('--show-navbar', "hidden");
      document.body.style.setProperty('--opacity-navbar', "0");

    }
  }
}
