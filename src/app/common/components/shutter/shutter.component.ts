import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-shutter',
  templateUrl: './shutter.component.html',
  styleUrls: ['./shutter.component.scss'],
  standalone: true,
  imports: [TranslateModule]
})
export class ShutterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
