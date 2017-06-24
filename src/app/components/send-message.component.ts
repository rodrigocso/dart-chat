import { Component, ElementRef, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Message } from '../model/message';
import { MessagesService } from '../services/messages.service';
import { User } from '../model/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'dart-send-msg',
  templateUrl: '../templates/send-message.component.html'
})
export class SendMessageComponent implements OnInit {
  private user: User;
  private msgBox: HTMLInputElement;

  constructor(
    private userService: UserService,
    private msgsService: MessagesService,
    private el: ElementRef) {
  }

  ngOnInit() {
    this.userService.getUser().subscribe((user: User) => this.user = user);
    this.msgBox = this.el.nativeElement.querySelector('textarea');
  }

  onKeyup(event: KeyboardEvent): void {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.sendMessage(this.msgBox);
    }
  }

  sendMessage(msgBox: HTMLInputElement): void {
    this.msgsService.sendMessage({
      name: this.user.name,
      photoUrl: this.user.photoUrl || '/assets/images/profile_placeholder.png',
      text: msgBox.value
    });
    msgBox.value = null;
  }
}
