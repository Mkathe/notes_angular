import { Service } from '@angular/core';

@Service()
export class NotesService {
    notes: any[] = [];

    constructor() {
    const savedNotes = localStorage.getItem('notes');

    if (savedNotes) {
      this.notes = JSON.parse(savedNotes);
        }
    }

    getNotes() {
        return this.notes;
    }

    addNote(title: string, text: string) {

        const note = {
        title: title,
        text: text
        };

        this.notes.push(note);

        localStorage.setItem(
        'notes',
        JSON.stringify(this.notes)
        );
    }

    deleteNote(index: number) {

        this.notes.splice(index, 1);

        localStorage.setItem(
        'notes',
        JSON.stringify(this.notes)
        );
    }
}
