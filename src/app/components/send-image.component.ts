import { Component, ElementRef, OnInit } from '@angular/core';
import { Message } from '../model/message';
import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { MessagesService } from '../services/messages.service';
import { StorageService } from '../services/storage.service';
import { ProgressBarService } from '../services/progress-bar.service';

@Component({
  selector: 'dart-send-img',
  templateUrl: '../templates/send-image.component.html'
})
export class SendImageComponent implements OnInit {
  private user: User;
  private btn: HTMLButtonElement;

  constructor(
    private userService: UserService,
    private msgsService: MessagesService,
    private storageService: StorageService,
    private progressBarService: ProgressBarService,
    private el: ElementRef) {
  }

  ngOnInit() {
    this.userService.getUser().subscribe((user: User) => this.user = user);
    this.btn = this.el.nativeElement.querySelector('button');
  }

  sendImage(event: Event): void {
    event.preventDefault();
    this.el.nativeElement.querySelector('#mediaCapture').click();
  }

  onChange(event: any): void {
    event.preventDefault();
    let file: File = event.target.files[0];
    this.btn.disabled = true;
    if (!file.type.match('image.*')) {
      this.btn.disabled = false;
      return;
    }

    this.msgsService.sendAttachment(this.user, file)
      .then((msgData) => {
        let uploadTask = this.storageService.createUploadTask(this.user.uid, file);
        this.progressBarService.show();
        this.progressBarService.setProgress(0);
        this.storageService.getUploadOnStateChanged(uploadTask)(
          snapshot => this.onUploadProgressUpdate(snapshot),
          error => this.onUploadError(error),
          () => this.onUploadComplete(msgData, uploadTask)
        );
      });
  }

  private onUploadError(error: any): void {
    this.btn.disabled = false;
  }

  private onUploadProgressUpdate(snapshot: any): void {
    this.progressBarService.setProgress(snapshot.bytesTransferred / snapshot.totalBytes * 100);
  }

  private onUploadComplete(msgData: any, uploadTask: any): void {
    msgData.update({ imageUrl: this.storageService.getUploadFullPath(uploadTask) });
    setTimeout(() => this.progressBarService.hide(), 1000);
    this.btn.disabled = false;
  }
}
