import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Message } from '../model/message';
import { User } from '../model/user';

declare var firebase: any;

@Injectable()
export class MessagesService {
  private database: any;
  private messages: any;
  private channels: any;
  private currentChannel: string;
  private msgSubject: Subject<Message> = new Subject<Message>();
  private channelSubject: Subject<string> = new Subject<string>();

  constructor() {
    this.database = firebase.database();
  }

  private setMessage(data: any): void {
    let msg: Message = new Message(data.key, data.val());
    this.msgSubject.next(msg);
  }

  private setChannel(data: any): void {
    let channel: string = data.val().channel;
    this.channelSubject.next(channel);
  }

  getMessages(channel: string): Observable<Message> {
    this.currentChannel = channel;
    this.messages = this.database.ref('messages');
    this.messages.off();
    this.messages.orderByChild('channel').equalTo(channel).limitToLast(12).on('child_added', this.setMessage.bind(this));
    this.messages.orderByChild('channel').equalTo(channel).limitToLast(12).on('child_changed', this.setMessage.bind(this));
    return this.msgSubject.asObservable();
  }

  getChannels(): Observable<string> {
    this.channels = this.database.ref('channel');
    this.channels.off();
    this.channels.on('child_added', this.setChannel.bind(this));
    return this.channelSubject.asObservable();
  }

  sendMessage(msgData: any): void {
    msgData.channel = this.currentChannel;
    this.messages.push(msgData);
  }

  createChannel(channel: string): void {
    this.channels.push({ channel: channel });
  }

  sendAttachment(user: User, file: File): Promise<any> {
    return this.messages.push({
      name: user.name,
      photoUrl: user.photoUrl || '/assets/images/profile_placeholder.png',
      imageUrl: 'https://www.google.com/images/spin-32.gif',
      channel: this.currentChannel
    });
  }

  getOlderMessages(oldestMsg: Message, callback: (msgData: any) => void): void {
    this.database.ref('messages').orderByChild('channel').equalTo(this.currentChannel).off('child_added', callback);
    this.database.ref('messages').orderByChild('channel').equalTo(this.currentChannel).limitToLast(15).on('child_added', callback);
    //.orderByKey().endAt(oldestMsg.key).limitToLast(5).on('child_added', callback);
  }
}


