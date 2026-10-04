import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Notes } from './components/notes/notes';

@Component({
  imports: [RouterOutlet, Notes],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('notes-angular');
}
