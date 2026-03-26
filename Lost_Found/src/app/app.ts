import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PostItem } from "./features/post-item/post-item";
import { Dashboard } from './features/dashboard/dashboard';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PostItem, Dashboard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Lost_Found');
}
