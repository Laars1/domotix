import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  standalone: true,
  imports: []
})
export class NavigationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    document.body.style.setProperty('--navbar-width', "0");
  }

  open() : void{
    document.body.style.setProperty('--navbar-width', "250px");
  }

  close() : void{
    document.body.style.setProperty('--navbar-width', "0");
  }

}
