import { Injectable, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, user } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { UserInterface } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth)
  user$ = user(this.firebaseAuth)
  currentUserSig = signal<UserInterface | null | undefined>(undefined)

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
}

// todo in home:
// implements OnInit
// authService = inject(AuthService);
// ngOnInit(): void {
//   this.authService.user$.subscribe(user =>{
//     if(user) {
//       this.authService.currentUserSig.set({
//         email: user.email!,
//         username: user.displayName!
//       });
//     } else {
//       this.authService.currentUserSig.set(null);
//     }
//     console.log(this.authService.currentUserSig());
//   });
// }