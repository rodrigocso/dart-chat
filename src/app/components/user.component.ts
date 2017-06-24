import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'dart-user',
  templateUrl: '../templates/user.component.html'
})
export class UserComponent implements OnInit {
  private userState: Observable<User>;
  private user: User;

  constructor(private userService: UserService,
              private domSanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.userState = this.userService.getUser();
    this.userState.subscribe((user: User) => this.user = user);
  }

  googleSignIn(): void {
    this.userService.googleSignIn();
  }

  signOut(): void {
    this.userService.signOut();
  }

  getPhotoUrl(): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(this.user.photoUrl);
  }
}
