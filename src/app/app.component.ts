import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ShelfComponent } from './shelf/shelf.component';
import { FavShelfComponent } from './fav-shelf/fav-shelf.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ShelfComponent, FavShelfComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
