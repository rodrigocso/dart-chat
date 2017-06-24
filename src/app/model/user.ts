export class User {
  uid: string;
  name: string;
  email: string;
  photoUrl: string;

  constructor(userData: any) {
    this.uid = userData.uid;
    this.name = userData.displayName;
    this.email = userData.email;
    this.photoUrl = userData.photoURL;
  }
}
