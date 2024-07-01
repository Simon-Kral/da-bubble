import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { query, orderBy, limit, where, Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, setDoc, Unsubscribe } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnDestroy, OnInit	{

  firestore: Firestore = inject(Firestore);

  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }

}
