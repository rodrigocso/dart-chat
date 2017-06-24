export class Message {
  key: string;
  name: string;
  photoUrl: string;
  text: string;
  imageUrl: string;

  constructor(key: string, msgData: any) {
    this.key = key;
    this.name = msgData.name;
    this.photoUrl = msgData.photoUrl;
    this.text = msgData.text;
    this.imageUrl = msgData.imageUrl;
  }
}
