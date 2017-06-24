import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user';

declare var firebase: any;

@Injectable()
export class UserService {
  private auth: any;
  private subject: Subject<User> = new Subject<User>();

  constructor() {
    this.auth = firebase.auth();
  }

  private setUser(userData: any): void {
    let user: User = new User(userData);
    this.subject.next(user);
  }

  getUser(): Observable<User> {
    if (this.auth.currentUser) {
      this.setUser(this.auth.currentUser);
    }
    return this.subject.asObservable();
  }

  googleSignIn(): void {
    let provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider)
      .then(() => this.setUser(this.auth.currentUser))
      .catch((error) => console.log(error));
  }

  signOut() {
    this.auth.signOut();
    this.subject.next(null);
  }
}
