import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { KeyValuePair } from '../model/key-value-pair';

declare var firebase: any;

@Injectable()
export class StorageService {
  private storage: any;

  constructor() {
    this.storage = firebase.storage();
  }

  getImageUrl(img: KeyValuePair<string>): Observable<KeyValuePair<string>> {
    let imgSubject: Subject<KeyValuePair<string>> = new Subject<KeyValuePair<string>>();
    imgSubject.next({ key: img.key, value: 'https://www.google.com/images/spin-32.gif' });

    if (img.value.substr(0, 5) === 'gs://') {
      this.storage.refFromURL(img.value).getMetadata()
        .then(metadata => {
          imgSubject.next({ key: img.key, value: metadata.downloadURLs[0] });
          imgSubject.complete();
        });
    }

    return imgSubject.asObservable();
  }

  createUploadTask(uid: string, file: File): any {
    return this.storage.ref(uid + '/' + Date.now() + '/' + file.name)
      .put(file, { 'contentType': file.type });
  }

  getUploadOnStateChanged(uploadTask: any): Function {
    return uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED);
  }

  getUploadFullPath(uploadTask: any): string {
    return this.storage.ref(uploadTask.snapshot.metadata.fullPath).toString();
  }
}

