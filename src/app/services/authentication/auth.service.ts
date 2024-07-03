import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { UserInterface } from './user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<UserInterface | null | undefined>(undefined);
  router = inject(Router);

  register(
    email: string,
    username: string,
    password: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) =>
      updateProfile(response.user, { displayName: username })
    );
    return from(promise);
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
    const promise = updateProfile(auth.currentUser!, { photoURL: avatar });
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  checkUserStatus() {
    this.user$.subscribe((user) => {
      if (user) {
        this.setInitialUserSignal(user);
        if (user.photoURL) {
          this.updateUserAvatar(user);
        } else {
          this.router.navigateByUrl('/avatar');
        }
      } else {
        this.handleUserUnset();
      }
    });
  }

  setInitialUserSignal(user: User) {
    this.currentUserSig.set({
      email: user.email!,
      username: user.displayName!,
    });
  }

  updateUserAvatar(user: User) {
    this.currentUserSig.update((prevUser: UserInterface | null | undefined) => {
      prevUser!.avatar = user.photoURL!;
      return prevUser;
    });
    this.router.navigateByUrl('/home');
  }

  handleUserUnset() {
    this.currentUserSig.set(null);
    this.router.navigateByUrl('/');
  }
}
