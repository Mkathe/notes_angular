import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../services/notes';


@Component({
  imports: [CommonModule],
  selector: 'app-notes',
  styleUrl: './notes.css',
  templateUrl: './notes.html',
})
export class Notes {
  notes: any[] = [];

  constructor(private notesService: NotesService) {
    this.loadNotes();
  }

  loadNotes() {
    this.notes = this.notesService.getNotes();
  }

  addNote(title: HTMLInputElement, text: HTMLTextAreaElement) {

    if (title.value.trim() === '' || text.value.trim() === '') {
      return;
    }

    this.notesService.addNote(
      title.value.trim(),
      text.value.trim()
    );

    this.loadNotes();

    title.value = '';
    text.value = '';
  }

  deleteNote(index: number) {
    this.notesService.deleteNote(index);

    this.loadNotes();
  }
}
