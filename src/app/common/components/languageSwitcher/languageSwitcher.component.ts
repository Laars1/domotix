import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-languageSwitcher',
  templateUrl: './languageSwitcher.component.html',
  styleUrls: ['./languageSwitcher.component.css'],
  imports: [RouterOutlet, TranslateModule],
  standalone: true
})
export class LanguageSwitcherComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
