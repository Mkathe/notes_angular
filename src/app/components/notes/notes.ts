
import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotesService } from '../../services/notes';

@Component({
  imports: [CommonModule],
  selector: 'app-notes',
  styleUrl: './notes.css',
  templateUrl: './notes.html',
})

export class Notes implements OnDestroy {
  notes: any[] = [];

  errorMessage = '';
  successMessage = '';
  isLoading = true;
  isSaving = false;

  private notesSubscription?: Subscription;

  constructor(private notesService: NotesService, private cdr: ChangeDetectorRef) {
    this.loadNotes();
  }

  loadNotes() {
    this.isLoading = true;
    this.errorMessage = '';

    this.notesSubscription = this.notesService
      .getNotes()
      .subscribe({
        next: (notes) => {
          this.notes = notes;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading notes:', error);

          this.errorMessage = 'Failed to load notes. Please try again.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  async addNote(title: HTMLInputElement, text: HTMLTextAreaElement) {
    const noteTitle = title.value.trim();
    const noteText = text.value.trim();

    this.errorMessage = '';
    this.successMessage = '';

    if (!noteTitle || !noteText) {
      this.errorMessage = 'Please fill in both fields.';
      return;
    }

    this.isSaving = true;

    try {
      await this.notesService.addNote(noteTitle, noteText);

      title.value = '';
      text.value = '';

      this.successMessage = 'Note added successfully!';
    } catch (error) {
      console.error('Error adding note:', error);
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isSaving = false;
      this.cdr.detectChanges();
    }
  }

  async deleteNote(id: string) {
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.notesService.deleteNote(id);
      this.successMessage = 'Note deleted successfully!';
    } catch (error) {
      console.error('Error deleting note:', error);
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.cdr.detectChanges();
    }
  }

  private getErrorMessage(error: unknown): string {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? String(error.code)
        : '';

    if (code.includes('permission-denied')) {
      return 'Access denied. Check your Firebase security rules.';
    }

    if (code.includes('unavailable')) {
      return 'Firebase is temporarily unavailable. Check your connection.';
    }

    if (code.includes('unauthenticated')) {
      return 'You must sign in to perform this action.';
    }

    return 'Something went wrong. Please try again.';
  }

  ngOnDestroy() {
    this.notesSubscription?.unsubscribe();
  }
}
