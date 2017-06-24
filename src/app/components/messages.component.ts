import { Component, ElementRef, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Message } from '../model/message';
import { MessagesService } from '../services/messages.service';
import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { StorageService } from '../services/storage.service';
import { KeyValuePair } from '../model/key-value-pair';
import { ProgressBarService } from '../services/progress-bar.service';

@Component({
  selector: 'dart-messages',
  templateUrl: '../templates/messages.component.html',
  providers: [ProgressBarService]
})
export class MessagesComponent implements OnInit {
  private user: User;
  private currentChannel: string;
  private channels: Array<string> = [];
  private msgs: Array<Message> = [];
  private msgKeys: Array<string> = [];
  private msgsElem: HTMLElement;
  private channelDropdown: HTMLElement;
  private msgsLoaded: boolean = false;
  private delayedLoading: boolean = false;

  private prevScrollTop: number = 0;
  private userScrolledUp: boolean = false;

  constructor(
    private userService: UserService,
    private msgsService: MessagesService,
    private storageService: StorageService,
    private sanitizer: DomSanitizer,
    private el: ElementRef,
    private pbs: ProgressBarService) {
  }

  ngOnInit() {
    this.userService.getUser().subscribe((user: User) => this.onUserChange(user));
    this.msgsElem = this.el.nativeElement.querySelector('#messages');
    this.msgsElem.onscroll = this.onScroll.bind(this);
    this.channelDropdown = this.el.nativeElement.querySelector('#channel-selector');
    this.pbs.setElement(this.el.nativeElement.querySelector('#progress'));
    this.pbs.setProgress(0);
    this.pbs.hide();
  }

  onScroll(event: Event): void {
    this.userScrolledUp = (this.prevScrollTop > this.msgsElem.scrollTop);

    if (this.user && this.userScrolledUp && this.msgsElem.scrollTop == 0) {
      this.userScrolledUp = false;
      this.msgsService.getOlderMessages(this.msgs[0], (data) => {
        let msg: Message = new Message(data.key, data.val());
        this.onMessageChange(msg, true);
        this.msgsElem.scrollTop += 10;
      });
    }

    this.prevScrollTop = this.msgsElem.scrollTop;
  }

  scrollToBottom(): void {
    setTimeout(() => this.msgsElem.scrollTop = this.msgsElem.scrollHeight, 500);
  }

  private onUserChange(user: User): void {
    this.user = user;
    this.currentChannel = 'Default';
    if (user) {
      this.userScrolledUp = false;
      this.channelDropdown.hidden = false;
      this.delayedLoading = false;
      this.msgsService.getChannels().subscribe((channel: string) => this.onChannelChange(channel));
      this.msgsService.getMessages(this.currentChannel).subscribe((msg: Message) => this.onMessageChange(msg, false));
    }
    else {
      this.channelDropdown.hidden = true;
      this.channels = [];
      this.msgs = [];
      this.msgKeys = [];
    }
  }

  private onChannelChange(channel: string): void {
    if (this.channels.indexOf(channel) < 0) {
      this.channels.push(channel);
    }
  }

  private onMessageChange(msg: Message, insertOnTop: boolean): void {
    if (this.msgKeys.indexOf(msg.key) < 0) {
      insertOnTop ? this.msgs.unshift(msg) : this.msgs.push(msg);
      this.msgKeys.push(msg.key);
      if (!msg.photoUrl) {
        msg.photoUrl = 'https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg';
      }
    }
    if (msg.imageUrl) {
      this.storageService.getImageUrl({ key: msg.key, value: msg.imageUrl })
        .subscribe((imgKey: KeyValuePair<string>) => this.onImageLoad(imgKey, insertOnTop));
    }
  }

  private onImageLoad(imgKey: KeyValuePair<string>, insertOnTop: boolean): void {
    if (this.msgsLoaded) {
      let img: HTMLImageElement = this.el.nativeElement.querySelector('#' + imgKey.key + ' .msg-image');
      img.src = imgKey.value;

      if (!insertOnTop) {
        img.onload = () => {
          this.scrollToBottom();
          img.onload = null;
        };
      }
    }
    else {
      this.delayedLoading = true;
    }
  }

  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  setMsgsLoaded(): void {
    this.msgsLoaded = true;
    if (this.delayedLoading) {
      this.delayedLoading = false;
      for (let msg of this.msgs) {
        if (msg.imageUrl) {
          this.storageService.getImageUrl({ key: msg.key, value: msg.imageUrl })
            .subscribe((imgKey: KeyValuePair<string>) => this.onImageLoad(imgKey, false));
        }
      }
    }
  }

  displayChannelCreator(channelSelector: HTMLElement, channelCreator: HTMLElement): void {
    channelSelector.hidden = true;
    channelCreator.hidden = false;
  }

  displayChannelSelector(channelSelector: HTMLElement, channelCreator: HTMLElement, textInput: HTMLInputElement): void {
    channelSelector.hidden = false;
    channelCreator.hidden = true;
    textInput.value = null;
  }

  createChannel(channelSelector: HTMLElement, channelCreator: HTMLElement, textInput: HTMLInputElement): void {
    if (textInput.value) {
      channelCreator.hidden = true;
      channelSelector.hidden = false;
      this.msgsService.createChannel(textInput.value);
      this.changeChannel(textInput.value);
      textInput.value = null;
    }
  }

  changeChannel(channel: string): void {
    this.currentChannel = channel;
    this.delayedLoading = false;
    this.userScrolledUp = false;
    this.msgsLoaded = false;
    this.prevScrollTop = 0;
    this.msgs = [];
    this.msgKeys = [];
    this.msgsService.getMessages(this.currentChannel).subscribe((msg: Message) => this.onMessageChange(msg, false));
  }
}
