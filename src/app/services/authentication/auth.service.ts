import { Injectable, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { UserInterface } from './user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth)
  user$ = user(this.firebaseAuth)
  currentUserSig = signal<UserInterface | null | undefined>(undefined)
  router = inject(Router)

  register(email: string, username: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(response => updateProfile(response.user, {displayName: username})
    );
    return from(promise)
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {});
    return from(promise);
  }

  setAvatar(avatar: string): Observable<void> {
    const auth = this.firebaseAuth;
    const promise = updateProfile(
      auth.currentUser!,
      {photoURL: avatar}
    )
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  checkUserStatus() {
    this.user$.subscribe(user =>{
      if(user) {
        if(user.photoURL) {
          this.currentUserSig.set({
            email: user.email!,
            username: user.displayName!,
            avatar: user.photoURL!
          });
          console.log(this.currentUserSig())
          this.router.navigateByUrl('/home');
        } else {
          this.currentUserSig.set({
            email: user.email!,
            username: user.displayName!
          });
          this.router.navigateByUrl('/avatar');
        }

      } else {
        this.currentUserSig.set(null);
        this.router.navigateByUrl('/');
      }
    });
  }

}