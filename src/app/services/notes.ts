import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private notesCollection = collection(db, 'notes');

  getNotes(): Observable<any[]> {
  return new Observable<any[]>(observer => {
    const unsubscribe = onSnapshot(
      this.notesCollection,
      snapshot => {
        const notes = snapshot.docs.map(note => ({
          id: note.id,
          ...note.data()
        }));
        
        console.log('Firestore documents:', snapshot.size);
        console.log('Firestore notes:', notes); 

        observer.next(notes);
      },
      error => observer.error(error)
    );

    return unsubscribe;
  });
  }

  addNote(title: string, text: string) {
    return addDoc(this.notesCollection, { title, text });
  }

  deleteNote(id: string) {
    return deleteDoc(doc(db, 'notes', id));
  }
}
